package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.dao.UserTempModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RegularAuditService regularAuditService;

    public List<UserModel> getAllUsers() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to fetch all users", email, "Fetching users from database", true));
        return userRepository.findAll();
    }

    public UserModel findUserModel(String id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to fetch user using id", email, "Fetching user from database", true));
        return userRepository.findByUserId(id);
    }

    public ResponseEntity<? extends Object> findUserDetails(String id) {
        List<String> errors = new ArrayList<>();
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to find user details using id", email, "Fetching user from database", true));
        UserModel userModel = userRepository.findByUserId(id);
        if (userModel == null) {
            errors.add("Invalid user id");
            regularAuditService.audit(new RegularAuditModel("Request to find user details", email, "No user found", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "No user found for the provided email", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        if (email.equals(userModel.getEmail())) {
            regularAuditService.audit(new RegularAuditModel("Request to find user details using id", email, "User details sent", true));
            UserTempModel userTempModel = new UserTempModel(userModel.getUsername(), userModel.getMobileNumber(), userModel.isActive(), userModel.getEmail());
            return ResponseEntity.ok().body(userTempModel);
        } else {
            errors.add("Invalid request");
            regularAuditService.audit(new RegularAuditModel("Request to find user details using id", email, "Unauthorized request", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "Your request cannot be processed.", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
    }
}
