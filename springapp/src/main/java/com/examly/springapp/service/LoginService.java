package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.email.EmailSenderService;
import com.examly.springapp.model.LoginModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;

@Service
public class LoginService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RegularAuditService regularAuditService;

    public boolean checkUser(LoginModel loginModel) {
        UserModel user = userRepository.findByEmail(loginModel.getEmail());
        regularAuditService.audit(new RegularAuditModel("Request to check for user", loginModel.getEmail(), "", true));
		return user != null;
	}

    public ResponseEntity<?> forgot(String email) {
        List<String> errors = new ArrayList<>();
        UserModel userModel = userRepository.findByEmail(email);
        if (userModel == null) {
            regularAuditService.audit(new RegularAuditModel("Request for forgot password",  email, "No user for found", false));
            errors.add("User not found");
            return ResponseEntity.ok().body(new ApiResponse(false, "No user found for given email", FORBIDDEN.value(), FORBIDDEN, errors));
        } else {
            String code = String.valueOf(UUID.randomUUID()) + UUID.randomUUID();
            code = code.replaceAll("-", "");
            String body = "    <h3>Dear " + userModel.getUsername() + ",</h3>\n" +
                    "    <p>This email is in response to a request to reset your Ebook store password.</p>\n" +
                    "    <p>Code: " + code + "</p>\n" +
                    "    <p>Enter this code in the field provided to reset your password.</p>\n" +
                    "    <p>If you did not make this request, you can ignore this email and your password won't be changed.\n" +
                    "    </p>\n" +
                    "    <br>\n" +
                    "    <p>Thanks for using our services, Ebook Store (Team 2)</p><hr style=\"border: 0;height: 1px;background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));\"></hr><a href=\"http://localhost:4200\"><img src=\"https://rukminim1.flixcart.com/flap/500/500/image/b3fe381767050079.jpg?q=100\"></img></a>";
            try {
                regularAuditService.audit(new RegularAuditModel("Request for forgot password",  email, "Mail with code has been sent", true));
                emailSenderService.sendMail(userModel.getEmail(), "Ebook Store - Reset your password", body);
            } catch (MessagingException e) {
                e.printStackTrace();
                errors.add(e.getLocalizedMessage());
                regularAuditService.audit(new RegularAuditModel("Request to load user",  email, "There was an issue in sending mail", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "There was an issue in sending mail", FORBIDDEN.value(), FORBIDDEN, errors));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                errors.add("The encoding of mail is not supported");
                regularAuditService.audit(new RegularAuditModel("Request to load user",  email, "The encoding of mail is not supported", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "There was an issue in sending mail", FORBIDDEN.value(), FORBIDDEN, errors));
            }
            userModel.setForgotCode(code);
            userRepository.save(userModel);
            regularAuditService.audit(new RegularAuditModel("Request to load user",  email, "Mail was sent and forgot password is saved", true));
            return ResponseEntity.ok().body(new ApiResponse(true, "The mail with code has been sent, please check your inbox", OK.value(), OK, errors));
        }
    }

    public ResponseEntity<?> verifyCode(String email, String code) {
        List<String> errors = new ArrayList<>();
        UserModel userModel = userRepository.findByEmail(email);
        if (userModel == null) {
            errors.add("User not found");
            regularAuditService.audit(new RegularAuditModel("Request to verify code for user",  email, "No user found", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "No user found for given email", FORBIDDEN.value(), FORBIDDEN, errors));
        } else {

            if (userModel.getForgotCode().equals(code)) {
                regularAuditService.audit(new RegularAuditModel("Request to verify code for user",  email, "The code was validated", true));
                return ResponseEntity.ok().body(new ApiResponse(true, "The given code was validated, please enter your new password", OK.value(), OK, errors));
            } else {
                errors.add("Invalid code");
                regularAuditService.audit(new RegularAuditModel("Request to load user",  email, "Invalid code provided for this user", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "Invalid code provided for this user", FORBIDDEN.value(), FORBIDDEN, errors));
            }
        }
    }

    public ResponseEntity<?> savePassword(String email, String password, String conformPassword, String code) throws MessagingException, UnsupportedEncodingException {
        List<String> errors = new ArrayList<>();
        if (!password.equals(conformPassword)) {
            errors.add("Invalid passwords");
            regularAuditService.audit(new RegularAuditModel("Request to save password",  email, "Both passwords are not equal", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "Both passwords doesn't match", FORBIDDEN.value(), FORBIDDEN, errors));
        } else {
            UserModel userModel = userRepository.findByEmail(email);
            if (userModel == null) {
                errors.add("User not found");
                regularAuditService.audit(new RegularAuditModel("Request to save password",  email, "No user found", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "No user found for given email", FORBIDDEN.value(), FORBIDDEN, errors));
            } else {
                if (!code.equals(userModel.getForgotCode())) {
                    errors.add("Wrong code");
                    regularAuditService.audit(new RegularAuditModel("Request to save password",  email, "Invalid code provided for this user", false));
                    return ResponseEntity.ok().body(new ApiResponse(false, "Invalid code provided for this user", FORBIDDEN.value(), FORBIDDEN, errors));
                } else {
                    userModel.setPassword(passwordEncoder.encode(password));
                    userModel.setForgotCode("");
                    String body = "    <h3>Dear " + userModel.getUsername() + ",</h3>\n" +
                            "    <p>This email is a response to let you know that your password has been changed.</p>\n" +
                            "    <p>If you are not the one that did this action, please contact Administrator to disable your account.</p>\n" +
                            "    <p>After subsequent discussions and verifications, your account can be activated again.\n" +
                            "    </p>\n" +
                            "    <br>\n" +
                            "    <p>Thanks for using our services, Ebook Store (Team 2)</p><hr style=\"border: 0;height: 1px;background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));\"></hr><a href=\"http://localhost:4200\"><img src=\"https://rukminim1.flixcart.com/flap/500/500/image/b3fe381767050079.jpg?q=100\"></img></a>";
                    emailSenderService.sendMail(userModel.getEmail(), "Password for your Ebook store is changed", body);
                    userRepository.save(userModel);
                    regularAuditService.audit(new RegularAuditModel("Request to save password",  email, "Password changed successfully", true));
                    return ResponseEntity.ok().body(new ApiResponse(true, "Password changed successfully", OK.value(), OK, errors));
                }
            }
        }
    }

    public boolean checkActive(String email) {
        UserModel userModel = userRepository.findByEmail(email);
        regularAuditService.audit(new RegularAuditModel("Request to check if user is active",  email, "", true));
        return userModel.isActive();
    }


}
