package com.examly.springapp.model;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.sql.Timestamp;
import java.time.Instant;

@Component
@Entity(name = "messages")
@Table(name = "messages")
public class MessageModel {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String messageId;

    @Column(name = "subject")
    @NotBlank(message = "Invalid subject for the mail")
    private String subject;

    @Column(name = "body")
    @NotBlank(message = "Invalid body for the mail")
    private String body;

    @Column(name = "user_email")
    @NotBlank(message = "Invalid email")
    private String userEmail;

    @Column(name = "time_stamp")
    private Timestamp timeStamp;

    public MessageModel() {

    }

    public MessageModel(String subject, String body, String userEmail) {
        this.subject = subject;
        this.body = body;
        this.userEmail = userEmail;
        this.timeStamp = Timestamp.from(Instant.now());
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
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

    public Timestamp getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Timestamp timeStamp) {
        this.timeStamp = timeStamp;
    }
}
