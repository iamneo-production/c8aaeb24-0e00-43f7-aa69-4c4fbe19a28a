package com.examly.springapp.audit;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;

@Entity(name = "audit")
@Table(name = "audit")
public class RegularAuditModel {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(name = "audit_id")
    private String id;

    @Column(name = "created_time")
    private Timestamp timestamp;

    @Column(name = "action")
    private String action;

    @Column(name = "user")
    private String user;

    @Column(name = "info")
    private String info;

    @Column(name = "result")
    private boolean result;

    public RegularAuditModel() {

    }

    public RegularAuditModel(String action, String user, String info, boolean result) {
        this.timestamp = Timestamp.from(Instant.now());
        this.action = action;
        this.user = user;
        this.info = info;
        this.result = result;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public boolean getResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }
}
