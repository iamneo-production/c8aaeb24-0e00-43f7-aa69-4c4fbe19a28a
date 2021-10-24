package com.examly.springapp.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.examly.springapp.email.EmailSenderService;
import com.examly.springapp.mfa.TotpManager;
import com.examly.springapp.model.LoginModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import com.examly.springapp.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TotpManager totpManager;

    @Autowired
    private EmailSenderService emailSenderService;

    @PostMapping("/login")
    public ResponseEntity<?> checkUser(@RequestBody LoginModel loginModel) {
        List<String> errors = new ArrayList<>();
        try {
            if (loginService.checkUser(loginModel)) {
                this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginModel.getEmail(), loginModel.getPassword()));
                return ResponseEntity.ok().body(true);
            } else {
                System.out.println(loginModel);


                errors.add("Bad Credentials");
                return ResponseEntity.ok().body(new ApiResponse(false, "No user was found for the above credentials", FORBIDDEN.value(), FORBIDDEN, errors));
            }
        } catch (Exception e) {
            e.printStackTrace();
            errors.add(e.getLocalizedMessage());
            return ResponseEntity.ok().body(new ApiResponse(false, "No user was found for the above credentials", FORBIDDEN.value(), FORBIDDEN, errors));
        }

    }


    @PostMapping("/verify/{code}")
    public ResponseEntity<?> verify(@PathVariable String code, @RequestBody LoginModel loginModel) throws MessagingException, UnsupportedEncodingException {
        List<String> errors = new ArrayList<>();
        String username = loginModel.getEmail();
        UserModel userModel = userRepository.findByEmail(username);
        String secret = userModel.getSecret();
        String pass = passwordEncoder.encode(loginModel.getPassword());
        if (totpManager.verifyCode(code, secret)) {
            userModel.setVerifiedForTOTP(true);
            Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
            String role = userModel.getRole();
            List<String> roles = new ArrayList<>();
            roles.add(role);
            System.out.println(roles);
            String access_token = JWT.create()
                    .withSubject(userModel.getEmail())
                    .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 1000))
                    .withIssuer("http://localhost:8080/login")
                    .withClaim("user_id", userModel.getUserId())
                    .withClaim("roles", roles)

                    .sign(algorithm);
            String body = "    <h3>Dear " + userModel.getUsername() + ",</h3>\n" +
                    "    <p>This email is a response to let you know that your account has been activated for two step verification.</p>\n" +
                    "    <p>If you lose access to the Authenticator app, please contact Administrator to remove the two step verification for your account.</p>\n" +
                    "    <p>Thanks for visiting our store, happy reading!\n" +
                    "    </p>\n" +
                    "    <br>\n" +
                    "    <p>Thanks for using our services, Ebook Store (Team 2)</p><hr style=\"border: 0;height: 1px;background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));\"></hr><a href=\"http://localhost:4200\"><img src=\"https://rukminim1.flixcart.com/flap/500/500/image/b3fe381767050079.jpg?q=100\"></img></a>";
            emailSenderService.sendMail(userModel.getEmail(), "Kudos for the security option", body);
            userRepository.save(userModel);
            return ResponseEntity.ok().body(new ApiResponse(true, access_token, OK.value(), OK, errors));
        } else {
            errors.add("Invalid otp");
            return ResponseEntity.ok().body(new ApiResponse(false, "The OTP is not valid", FORBIDDEN.value(), FORBIDDEN, errors));
        }


    }

    @GetMapping("/generate/{id}")
    public ResponseEntity<?> generate(@PathVariable String id) {
        return ResponseEntity.ok().body(new ApiResponse(true, totpManager.getUriForImage(id, "", ""), OK.value(), OK, new ArrayList<>()));
    }

    @PostMapping("/forgot")
    public ResponseEntity<?> forgot(@RequestBody LoginModel loginModel) {
        String email = loginModel.getEmail();
        return loginService.forgot(email);
    }

    @PostMapping("/verifyCode")
    public ResponseEntity<?> verifyCode(@RequestBody LoginModel loginModel) {
        String email = loginModel.getEmail();
        String code = loginModel.getPassword();
        return loginService.verifyCode(email, code);
    }

    @PostMapping("/savePassword")
    public ResponseEntity<?> savePassword(@RequestBody ChangePasswordModel changePasswordModel) throws MessagingException, UnsupportedEncodingException {
        return loginService.savePassword(changePasswordModel.email, changePasswordModel.password, changePasswordModel.conformPassword, changePasswordModel.code);
    }
}

class ChangePasswordModel {
    public String email;
    public String password;
    public String conformPassword;
    public String code;

    public ChangePasswordModel() {

    }

    public ChangePasswordModel(String email, String password, String conformPassword, String code) {
        this.email = email;
        this.password = password;
        this.conformPassword = conformPassword;
        this.code = code;
    }
}
