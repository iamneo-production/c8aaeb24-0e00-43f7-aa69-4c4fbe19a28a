package com.examly.springapp.controller;

import com.examly.springapp.model.LoginModel;
import com.examly.springapp.service.AdminActionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AdminActionsController {

    @Autowired
    private AdminActionsService adminActionsService;

    @PostMapping("/checkUser")
    public ResponseEntity<?> checkUser(@RequestBody LoginModel loginModel) {
        return adminActionsService.checkUser(loginModel.getEmail());
    }

    @PostMapping("/disableUser")
    public ResponseEntity<?> disableUser(@RequestBody LoginModel loginModel) {
        return adminActionsService.disableUser(loginModel.getEmail());
    }

    @PostMapping("/enableUser")
    public ResponseEntity<?> enableUser(@RequestBody LoginModel loginModel) {
        return adminActionsService.enableUser(loginModel.getEmail());
    }

    @PostMapping("/removeVerification")
    public ResponseEntity<?> removeVerification(@RequestBody LoginModel loginModel) {
        return adminActionsService.removeVerification(loginModel);
    }

    @GetMapping("/admin/messages")
    public ResponseEntity<?> getMessages() {
        return adminActionsService.getMessages();
    }

    @GetMapping("/admin/remove/{id}")
    public ResponseEntity<?> removeMessage(@PathVariable String id) {
        return adminActionsService.deleteMessage(id);
    }
}
