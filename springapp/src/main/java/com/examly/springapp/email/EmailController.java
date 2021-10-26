package com.examly.springapp.email;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.OK;

@RestController
@Aspect
public class EmailController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private RegularAuditService regularAuditService;

    @PostMapping("/mail")
    public ResponseEntity<?> sendEmail(@RequestBody EmailModel emailModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request for sending mail", email, "", true));
        ArrayList<String> emails = emailModel.getEmails();
        List<String> errors = new ArrayList<>();
        if (emailModel.getSubject() == "") {
            regularAuditService.audit(new RegularAuditModel("Request for sending mail", email,
                    "Subject was empty but then added default subject", true));
            emailModel.setSubject("EBook Store - Administrator");
        } else if (emailModel.getBody() == "") {
            errors.add("No body is present");
            regularAuditService
                    .audit(new RegularAuditModel("Request for sending mail", email, "Failed due to empty body", false));
            return ResponseEntity.ok()
                    .body(new ApiResponse(false, "The body was empty", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        if (emails.size() == 0 || emails.get(0) == "") {
            List<UserModel> users = userRepository.findAll();

            users.forEach(user -> {
                regularAuditService.audit(new RegularAuditModel("Request to send mail", email, user.getEmail(), true));
                if (user.getRole().equals("user")) {
                    try {
                        emailSenderService.sendMail(user.getEmail(), emailModel.getSubject(), emailModel.getBody());
                        regularAuditService.audit(
                                new RegularAuditModel("Request to send mail - success", email, user.getEmail(), true));
                    } catch (MessagingException e) {
                        e.printStackTrace();
                        regularAuditService
                                .audit(new RegularAuditModel("Request to send mail", email, user.getEmail(), false));
                    } catch (UnsupportedEncodingException e) {
                        regularAuditService.audit(
                                new RegularAuditModel("Request to send email mail", email, user.getEmail(), false));
                        e.printStackTrace();
                    }
                }
            });
        } else {
            emails.forEach(userMail -> {
                try {
                    regularAuditService.audit(new RegularAuditModel("Request to send mail", email, userMail, true));
                    emailSenderService.sendMail(userMail, emailModel.getSubject(), emailModel.getBody());
                    regularAuditService
                            .audit(new RegularAuditModel("Request to send mail - success", email, userMail, true));
                } catch (MessagingException e) {
                    regularAuditService.audit(new RegularAuditModel("Request to send mail", email, userMail, false));
                    e.printStackTrace();
                } catch (UnsupportedEncodingException e) {
                    regularAuditService.audit(new RegularAuditModel("Request to send mail", email, userMail, false));
                    e.printStackTrace();
                }

            });
        }

        regularAuditService.audit(new RegularAuditModel("Request to send mail to all - success", email, "", true));
        return ResponseEntity.ok()
                .body(new ApiResponse(true, "The mails are sent successfully", OK.value(), OK, errors));
    }

    @Async
    @AfterReturning(pointcut = "execution(* com.examly.springapp.service.SignupService.saveUser(..))", returning = "result")
    public void afterReturningSignupMail(JoinPoint joinPoint, ResponseEntity<?> result)
            throws MessagingException, UnsupportedEncodingException {
        ApiResponse res = (ApiResponse) result.getBody();
        if (200 != res.getStatus()) {
            return;
        } else {

        }
    }
}
