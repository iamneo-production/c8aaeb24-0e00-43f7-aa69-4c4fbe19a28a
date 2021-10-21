package com.examly.springapp.controller;

import com.examly.springapp.model.LoginModel;
import com.examly.springapp.service.AdminActionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminActionsController {

    @Autowired
    private AdminActionsService adminActionsService;

    @PostMapping("/checkUser")
    public ResponseEntity<?> checkUser(@RequestBody LoginModel loginModel) {
        return this.adminActionsService.checkUser(loginModel.getEmail());
    }

    @PostMapping("/disableUser")
    public ResponseEntity<?> disableUser(@RequestBody LoginModel loginModel) {
        return this.adminActionsService.disableUser(loginModel.getEmail());
    }

    @PostMapping("/enableUser")
    public ResponseEntity<?> enableUser(@RequestBody LoginModel loginModel) {
        return this.adminActionsService.enableUser(loginModel.getEmail());
    }

    @PostMapping("/removeVerification")
    public ResponseEntity<?> removeVerification(@RequestBody LoginModel loginModel) {
        return this.adminActionsService.removeVerification(loginModel);
    }
}
