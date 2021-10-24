package com.examly.springapp.controller;

import com.examly.springapp.dao.MessageUserModel;
import com.examly.springapp.model.LoginModel;
import com.examly.springapp.service.UserActionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserActionsController {

    @Autowired
    private UserActionsService userActionsService;


    @PostMapping("/user/message")
    public ResponseEntity<?> saveMessage(@RequestBody MessageUserModel messageUserModel) {
        return userActionsService.saveMessage(messageUserModel);
    }

    @PostMapping("/user/activatemfa")
    public ResponseEntity<?> activateMFA(@RequestBody LoginModel loginModel) {
        return userActionsService.enableTOTP(loginModel.getEmail(), loginModel.getPassword());
    }
}
