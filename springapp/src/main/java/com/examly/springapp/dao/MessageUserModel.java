package com.examly.springapp.dao;

import javax.validation.constraints.NotBlank;

public class MessageUserModel {

    private String subject;

    @NotBlank(message = "Invalid body of mail")
    private String body;

    @NotBlank(message = "Invalid mail")
    private String userEmail;

    public MessageUserModel() {

    }

    public MessageUserModel(String subject, String body, String userEmail) {
        this.subject = subject;
        this.body = body;
        this.userEmail = userEmail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
