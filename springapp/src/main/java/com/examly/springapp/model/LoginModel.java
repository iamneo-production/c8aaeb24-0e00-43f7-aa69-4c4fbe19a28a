package com.examly.springapp.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;


public class LoginModel {

    @Email(message = "Email address is invalid")
    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Password is mandatory")
    private String password;

    public LoginModel() {

    }

    public LoginModel(String email, String password) {
        super();
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
