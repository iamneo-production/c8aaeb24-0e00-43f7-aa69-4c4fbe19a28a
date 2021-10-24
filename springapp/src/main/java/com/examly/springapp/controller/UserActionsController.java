package com.examly.springapp.controller;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.dao.MessageUserModel;
import com.examly.springapp.model.LoginModel;
import com.examly.springapp.service.UserActionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserActionsController {

    @Autowired
    private UserActionsService userActionsService;

    @Autowired
    private RegularAuditService regularAuditService;


    @PostMapping("/user/message")
    public ResponseEntity<?> saveMessage(@RequestBody MessageUserModel messageUserModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to send message to admin", email, "", true));
        return userActionsService.saveMessage(messageUserModel);
    }

    @PostMapping("/user/activatemfa")
    public ResponseEntity<?> activateMFA(@RequestBody LoginModel loginModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to activate mfa", email, "", true));
        return userActionsService.enableTOTP(loginModel.getEmail(), loginModel.getPassword());
    }
}
