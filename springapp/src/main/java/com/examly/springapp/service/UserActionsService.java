package com.examly.springapp.service;

import com.examly.springapp.dao.MessageUserModel;
import com.examly.springapp.mfa.TotpManager;
import com.examly.springapp.model.MessageModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.MessageRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    public ResponseEntity<?> saveMessage(MessageUserModel messageUserModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        MessageModel messageModel = new MessageModel(messageUserModel.getSubject(), messageUserModel.getBody(), messageUserModel.getUserEmail());
        if(email.equals(messageModel.getUserEmail())) {
            messageRepository.save(messageModel);
            return ResponseEntity.ok().body(new ApiResponse(true, "Your message has been sent to admin", OK.value(), OK, new ArrayList<>()));
        }
        else {
            return ResponseEntity.ok().body(new ApiResponse(true, "Your are request cannot be processes", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, new ArrayList<>()));
        }

    }

    public ResponseEntity<?> enableTOTP(String emailId, String password) {
        List<String> errors = new ArrayList<>();
//        System.out.println(emailId + " " + password);
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetails user1 = new CustomUserDetailsService().loadUserByUsername(email);
        System.out.println("Vinny");
        System.out.println(user1.getPassword() + " " + password);
        if(email.equals(emailId)) {
            UserModel userModel = userRepository.findByEmail(email);
            if(userModel == null) {
                errors.add("Invalid user id");
                return ResponseEntity.ok().body(new ApiResponse(false, "No user found for given user id", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
            }
            else {
                UserDetails user = new CustomUserDetailsService().loadUserByUsername(userModel.getEmail());
                    String secret = userModel.getSecret();
                    return ResponseEntity.ok().body(new ApiResponse(true, totpManager.getUriForImage(secret, email, "EBook Store - Team 2"), OK.value(), OK, errors));
            }
        }
        else {
            errors.add("Invalid request");
            return ResponseEntity.ok().body(new ApiResponse(false, "Your request cannot be processed", OK.value(), OK, errors));
        }
    }
}
