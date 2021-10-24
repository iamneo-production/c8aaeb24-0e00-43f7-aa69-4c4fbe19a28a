package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.email.EmailSenderService;
import com.examly.springapp.mfa.TotpManager;
import com.examly.springapp.model.CartModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.validation.ConstraintViolation;
import javax.validation.Valid;
import javax.validation.Validation;
import javax.validation.ValidatorFactory;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Set;
import java.util.UUID;

import static org.springframework.http.HttpStatus.*;

@Service
public class SignupService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TotpManager totpManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private RegularAuditService regularAuditService;

    public ResponseEntity<?> saveUser(@Valid UserModel userModel) {
        boolean emailExists = userExistsWithEmail(userModel.getEmail());
        boolean userNameExists = userExistsWithUserName(userModel.getUsername());
        regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "Product added to database", true));
        ArrayList<String> errors = new ArrayList<>();
        if (!emailExists || !userNameExists) {
            try {
                ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
                Set<ConstraintViolation<UserModel>> violations = factory.getValidator().validate(userModel);
                for (ConstraintViolation<UserModel> violation : violations) {
                    errors.add(violation.getMessage());
                }
                if (errors.size() > 0) {
                    regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "Validation failed", false));
                    return new ResponseEntity<Object>(new ApiResponse(false, "Validation of bean failed", FORBIDDEN.value(), FORBIDDEN, errors), OK);
                }
            } catch (Exception e) {
                errors.add(e.getLocalizedMessage());
                regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "Exception caused", false));
                return new ResponseEntity<Object>(new ApiResponse(false, "There was an error", FORBIDDEN.value(), FORBIDDEN, errors), OK);
            }
        }
        try {
            if (emailExists && userNameExists) {
                errors.add("User already exists");
                errors.add("Signup unsuccessful");
                regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "User with email and username exists", false));
                return new ResponseEntity<Object>(new ApiResponse(false, "A user with this email and username already exists", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), OK);
            } else if (emailExists) {
                errors.add("User already exists");
                errors.add("Signup unsuccessful");
                regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "User with email exists", false));
                return new ResponseEntity<Object>(new ApiResponse(false, "A user with this email already exists", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), OK);
            } else if (userNameExists) {
                errors.add("User already exists");
                errors.add("Signup unsuccessful");
                regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "User with username exists", false));
                return new ResponseEntity<Object>(new ApiResponse(false, "A user with this username already exists", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), OK);
            } else {
                CartModel cart = new CartModel(null, "User Cart", "0", "0.0");
                String role = userModel.getUsername().equals("admin") ? "admin" : "user";
                userModel.setPassword(passwordEncoder.encode(userModel.getPassword()));
                String secret = UUID.randomUUID().toString();
                UserModel temp = new UserModel(null, userModel.getEmail(), userModel.getPassword(), userModel.getUsername(), userModel.getMobileNumber(), true, role, cart, null, userModel.isMfa(), secret);
                String body = "    <h3>Dear " + userModel.getUsername() + ",</h3>\n" +
                        "    <p>This email is a response to let you know that your account has been created.</p>\n" +
                        "    <p>We are excited to have you, and you may receive and be notified about offers via mail.</p>\n" +
                        "    <p>For any other queries, you may write a mail to team2.ebookstore@gmail.com.\n" +
                        "    </p>\n" +
                        "    <br>\n" +
                        "    <p>Thanks for using our services, Ebook Store (Team 2)</p><hr style=\"border: 0;height: 1px;background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));\"></hr><a href=\"http://localhost:4200\"><img src=\"https://rukminim1.flixcart.com/flap/500/500/image/b3fe381767050079.jpg?q=100\"></img></a>";
                emailSenderService.sendMail(userModel.getEmail(), "Welcome to Ebook store!", body);
                userRepository.save(temp);
                regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "Mail is sent after adding user", true));
                if (temp.isMfa()) {
                    HttpHeaders httpHeaders = new HttpHeaders();
                    httpHeaders.add("mfa", "true");
                    regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "User opted for mfa / sending QR", true));
                    return ResponseEntity.ok().headers(httpHeaders).body(new ApiResponse(true, totpManager.getUriForImage(secret, temp.getEmail(), "EBook Store - Team 2"), OK.value(), OK, errors));
                }
            }
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage().contains("constraint")) {
                errors.add(e.getLocalizedMessage());
                errors.add("Signup unsuccessful");
                regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "Constraint error", false));
                return new ResponseEntity<Object>(new ApiResponse(false, "There was a constraint error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), OK);
            }
        } catch (MessagingException e) {
            e.printStackTrace();
            regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "Error while sending mail", false));
        } catch (UnsupportedEncodingException e) {
            regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "Error while sending mail", false));
            e.printStackTrace();
        }
        regularAuditService.audit(new RegularAuditModel("Request for signup", userModel.getEmail(), "User creation successful", true));
        return new ResponseEntity<Object>(new ApiResponse(true, "User creation was successful", OK.value(), OK, errors), OK);
    }

    public boolean userExistsWithEmail(String email) {
        UserModel user = userRepository.findByEmail(email);

		return user != null;
	}

    public boolean userExistsWithUserName(String username) {
        UserModel user = userRepository.findByUsername(username);
		return user != null;
	}
}
