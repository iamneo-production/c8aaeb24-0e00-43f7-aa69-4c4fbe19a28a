package com.examly.springapp.controller;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.model.LoginModel;
import com.examly.springapp.service.AdminActionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AdminActionsController {

    @Autowired
    private AdminActionsService adminActionsService;

    @Autowired
    private RegularAuditService regularAuditService;

    @PostMapping("/checkUser")
    public ResponseEntity<?> checkUser(@RequestBody LoginModel loginModel) {
        regularAuditService.audit(new RegularAuditModel("Admin action, to ask for user details", loginModel.getEmail(), "", true));
        return adminActionsService.checkUser(loginModel.getEmail());
    }

    @PostMapping("/disableUser")
    public ResponseEntity<?> disableUser(@RequestBody LoginModel loginModel) {
        regularAuditService.audit(new RegularAuditModel("Admin action, to disable user", loginModel.getEmail(), "", true));
        return adminActionsService.disableUser(loginModel.getEmail());
    }

    @PostMapping("/enableUser")
    public ResponseEntity<?> enableUser(@RequestBody LoginModel loginModel) {
        regularAuditService.audit(new RegularAuditModel("Admin action, to enable user", loginModel.getEmail(), "", true));
        return adminActionsService.enableUser(loginModel.getEmail());
    }

    @PostMapping("/removeVerification")
    public ResponseEntity<?> removeVerification(@RequestBody LoginModel loginModel) {
        regularAuditService.audit(new RegularAuditModel("Admin action, to remove verification for a user", loginModel.getEmail(), "", true));
        return adminActionsService.removeVerification(loginModel);
    }

    @GetMapping("/admin/messages")
    public ResponseEntity<?> getMessages() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Admin action, to request for messages", email, "", true));
        return adminActionsService.getMessages();
    }

    @GetMapping("/admin/remove/{id}")
    public ResponseEntity<?> removeMessage(@PathVariable String id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Admin action, to request for delete a message", email, "", true));
        return adminActionsService.deleteMessage(id);
    }
}
