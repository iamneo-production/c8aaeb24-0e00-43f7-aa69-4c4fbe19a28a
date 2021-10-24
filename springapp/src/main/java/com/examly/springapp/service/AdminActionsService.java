package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.model.LoginModel;
import com.examly.springapp.model.MessageModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.MessageRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.*;

@Service
public class AdminActionsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginService loginService;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private RegularAuditService regularAuditService;

    public ResponseEntity<?> checkUser(String email) {
        List<String> errors = new ArrayList<>();
        UserModel userModel = userRepository.findByEmail(email);
        if (userModel == null) {
            regularAuditService.audit(new RegularAuditModel("User not found",  email, "", false));
            errors.add("Invalid user");
            return ResponseEntity.ok().body(new ApiResponse(false, "No user exists for this email", FORBIDDEN.value(), FORBIDDEN, errors));
        } else if (userModel.isActive()) {
            regularAuditService.audit(new RegularAuditModel("User is enabled",  email, "", true));
            return ResponseEntity.ok().body(new ApiResponse(true, "The user is in enabled state.", OK.value(), OK, errors));
        } else {
            regularAuditService.audit(new RegularAuditModel("User is disabled",  email, "", true));
            return ResponseEntity.ok().body(new ApiResponse(true, "The user is in disabled state.", OK.value(), OK, errors));
        }
    }

    public ResponseEntity<?> disableUser(String email) {
        List<String> errors = new ArrayList<>();
        UserModel userModel = userRepository.findByEmail(email);
        if (userModel == null) {
            regularAuditService.audit(new RegularAuditModel("User not found",  email, "", false));
            errors.add("Invalid user");
            return ResponseEntity.ok().body(new ApiResponse(false, "No user exists for this email", FORBIDDEN.value(), FORBIDDEN, errors));
        } else if (!userModel.isActive()) {
            regularAuditService.audit(new RegularAuditModel("User is already disabled",  email, "", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "The user is already disabled", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        } else {
            userModel.setActive(false);
            userRepository.save(userModel);
            regularAuditService.audit(new RegularAuditModel("User is now disabled",  email, "", true));
            return ResponseEntity.ok().body(new ApiResponse(true, "The user has been disabled", OK.value(), OK, errors));
        }
    }

    public ResponseEntity<?> enableUser(String email) {
        List<String> errors = new ArrayList<>();
        UserModel userModel = userRepository.findByEmail(email);
        if (userModel == null) {
            regularAuditService.audit(new RegularAuditModel("User not found",  email, "", false));
            errors.add("Invalid user");
            return ResponseEntity.ok().body(new ApiResponse(false, "No user exists for this email", FORBIDDEN.value(), FORBIDDEN, errors));
        } else if (userModel.isActive()) {
            regularAuditService.audit(new RegularAuditModel("User is already enabled",  email, "", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "The user is already enabled", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        } else {
            userModel.setActive(true);
            userRepository.save(userModel);
            regularAuditService.audit(new RegularAuditModel("User is now enables",  email, "", true));
            return ResponseEntity.ok().body(new ApiResponse(true, "The user has been enabled", OK.value(), OK, errors));
        }
    }

    public ResponseEntity<?> removeVerification(LoginModel loginModel) {
        List<String> errors = new ArrayList<>();
        UserModel userModel = userRepository.findByEmail(loginModel.getEmail());
        if (userModel == null) {
            errors.add("Invalid user");
            regularAuditService.audit(new RegularAuditModel("User not found",  loginModel.getEmail(), "", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "No user exists for this email", FORBIDDEN.value(), FORBIDDEN, errors));
        } else if (!userModel.isActive()) {
            regularAuditService.audit(new RegularAuditModel("User is disabled but requested for removal of verification",  loginModel.getEmail(), "", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "The user is disabled", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        } else if (!userModel.isVerifiedForTOTP()) {
            regularAuditService.audit(new RegularAuditModel("User has not mfa but requested for removal", loginModel.getEmail(), "", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "User doesn't have multi-factor authentication", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        } else {
            userModel.setVerifiedForTOTP(false);
            userRepository.save(userModel);
            regularAuditService.audit(new RegularAuditModel("Removed two step verification for user", loginModel.getEmail(), "", false));
            return ResponseEntity.ok().body(new ApiResponse(true, "Multi-factor authentication removed.", OK.value(), OK, errors));
        }
    }

    public ResponseEntity<?> getMessages() {
        regularAuditService.audit(new RegularAuditModel("Fetched messages from database",  "", "", true));
        return ResponseEntity.ok().body(messageRepository.findAll());
    }

    public ResponseEntity<?> deleteMessage(String messageId) {
        List<String> errors = new ArrayList<>();
        Optional<MessageModel> messageModel = messageRepository.findById(messageId);
        if (messageModel == null) {
            regularAuditService.audit(new RegularAuditModel("Request for delete with invalid message id",  "", "", false));
            errors.add("Invalid message id");
            return ResponseEntity.ok().body(new ApiResponse(false, "No message was for the given id", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        messageRepository.deleteById(messageId);
        regularAuditService.audit(new RegularAuditModel("Request to delete a message",  "", "", true));
        return ResponseEntity.ok().body(new ApiResponse(true, "The message was deleted", OK.value(), OK, errors));
    }

}
