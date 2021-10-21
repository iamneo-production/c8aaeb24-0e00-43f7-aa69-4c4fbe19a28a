package com.examly.springapp.email;

import java.util.ArrayList;

public class EmailModel {

    private ArrayList<String> emails;
    private String subject;
    private String body;

    public EmailModel() {

    }

    public EmailModel(ArrayList<String> emails, String subject, String body) {
        this.emails = emails;
        this.subject = subject;
        this.body = body;
    }

    public ArrayList<String> getEmails() {
        return emails;
    }

    public void setEmails(ArrayList<String> emails) {
        this.emails = emails;
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
}
