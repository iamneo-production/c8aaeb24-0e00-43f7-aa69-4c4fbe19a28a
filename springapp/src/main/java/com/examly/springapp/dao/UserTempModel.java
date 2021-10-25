package com.examly.springapp.dao;

public class UserTempModel {
    private String username;
    private String mobileNumber;
    private boolean active;
    private String email;

    public UserTempModel() {

    }

    public UserTempModel(String username, String mobileNumber, boolean active, String email) {
        this.username = username;
        this.mobileNumber = mobileNumber;
        this.active = active;
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}