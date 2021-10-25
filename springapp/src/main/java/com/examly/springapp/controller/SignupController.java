package com.examly.springapp.controller;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.service.SignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignupController {

    @Autowired
    private SignupService signupService;

    @Autowired
    private RegularAuditService regularAuditService;

    private UserModel userModel;

    @PostMapping("/signup")
    public ResponseEntity<?> saveUser(@RequestBody UserModel userModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request for saving new user", email, "", true));
        return signupService.saveUser(userModel);
    }
}
