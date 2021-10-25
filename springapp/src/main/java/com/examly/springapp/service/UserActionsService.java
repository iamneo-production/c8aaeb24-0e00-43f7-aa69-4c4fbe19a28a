package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.dao.MessageUserModel;
import com.examly.springapp.mfa.TotpManager;
import com.examly.springapp.model.MessageModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.MessageRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.OK;

@Service
public class UserActionsService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TotpManager totpManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RegularAuditService regularAuditService;


    public ResponseEntity<?> saveMessage(@Valid MessageUserModel messageUserModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<String> errors = new ArrayList<>();
        try {
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<MessageUserModel>> violations = validator.validate(messageUserModel);
            for (ConstraintViolation<MessageUserModel> violation : violations) {

                errors.add(violation.getMessage());
            }
            if (errors.size() > 0)
            {
                regularAuditService.audit(new RegularAuditModel("Request to send message to admin",  email, "Validation failed", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "Invalid data entered", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
            }
        } catch (ConstraintViolationException e) {
            regularAuditService.audit(new RegularAuditModel("Request to send message to admin",  email, "Constraint error was caused", false));
            errors.add(e.getMessage());
            return ResponseEntity.ok().body(new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        MessageModel messageModel = new MessageModel(messageUserModel.getSubject(), messageUserModel.getBody(), messageUserModel.getUserEmail());
        if (email.equals(messageModel.getUserEmail())) {
            messageRepository.save(messageModel);
            regularAuditService.audit(new RegularAuditModel("Request to send message to admin", email, "Message sent to admin", true));
            return ResponseEntity.ok().body(new ApiResponse(true, "Your message has been sent to admin", OK.value(), OK, new ArrayList<>()));
        } else {
            regularAuditService.audit(new RegularAuditModel("Request to send message to admin", email, "Unauthorized requested", false));
            return ResponseEntity.ok().body(new ApiResponse(true, "Your are request cannot be processes", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, new ArrayList<>()));
        }
    }

    public ResponseEntity<?> enableTOTP(String emailId, String password) {
        List<String> errors = new ArrayList<>();
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetails user1 = new CustomUserDetailsService().loadUserByUsername(email);
        regularAuditService.audit(new RegularAuditModel("Request to enable OTP", email, "", true));
        if (email.equals(emailId)) {
            UserModel userModel = userRepository.findByEmail(email);
            if (userModel == null) {
                errors.add("Invalid user id");
                regularAuditService.audit(new RegularAuditModel("Request to enable OTP", email, "Invalid user id", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "No user found for given user id", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
            } else {
                UserDetails user = new CustomUserDetailsService().loadUserByUsername(userModel.getEmail());
                String secret = userModel.getSecret();
                regularAuditService.audit(new RegularAuditModel("Request to enable OTP", email, "QR code generated for user", true));
                return ResponseEntity.ok().body(new ApiResponse(true, totpManager.getUriForImage(secret, email, "EBook Store - Team 2"), OK.value(), OK, errors));
            }
        } else {
            errors.add("Invalid request");
            regularAuditService.audit(new RegularAuditModel("Request to enable OTP", email, "Unauthorized request", true));
            return ResponseEntity.ok().body(new ApiResponse(false, "Your request cannot be processed", OK.value(), OK, errors));
        }
    }
}
