package com.examly.springapp.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity(name = "payments")
@Table(name = "payments")
public class PaymentModel {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String id;

    @NotBlank(message = "Invalid payment id")
    private String paymentId;

    @NotBlank(message = "Invalid user id")
    private String userId;

    @NotBlank(message = "Invalid amount")
    private String amount;

    @Email(message = "Invalid email")
    @NotBlank(message = "Invalid email")
    private String email;

    @NotBlank(message = "Invalid provider")
    private String provider;

    public PaymentModel() {

    }

    public PaymentModel(String paymentId, String userId, String amount, String email, String provider) {
        this.paymentId = paymentId;
        this.userId = userId;
        this.amount = amount;
        this.email = email;
        this.provider = provider;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }
}
