package com.examly.springapp.email;

import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
public class EmailController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailSenderService emailSenderService;

    @PostMapping("/mail")
    public ResponseEntity<?> sendEmail(@RequestBody EmailModel emailModel) {
        ArrayList<String> emails = emailModel.getEmails();
        List<String> errors = new ArrayList<>();
        if(emailModel.getSubject()==""){
            emailModel.setSubject("EBook Store - Administrator");
        }
        else if(emailModel.getBody()==""){
            errors.add("No body is present");
            return ResponseEntity.ok().body(new ApiResponse(false, "The body was empty", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        if(emails.size()==0 || emails.get(0)=="") {
            List<UserModel> users = userRepository.findAll();
//            System.out.println(users.size());
            users.forEach(user -> {
                if(user.getRole().equals("user")) {
                    try {
                        emailSenderService.sendMail(user.getEmail(), emailModel.getSubject(), emailModel.getBody());
                    } catch (MessagingException e) {
                        e.printStackTrace();
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                    System.out.println("Mail sent to " + user.getEmail());
                }
            });
        }
        else {
            emails.forEach(email -> {
                try {
                    emailSenderService.sendMail(email, emailModel.getSubject(), emailModel.getBody());
                } catch (MessagingException e) {
                    e.printStackTrace();
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                System.out.println("Mail sent to " + email);
            });
        }
//        System.out.println(emails.size());
        return ResponseEntity.ok().body(new ApiResponse(true, "The mails are sent successfully", OK.value(), OK, errors));
    }
}
