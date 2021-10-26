package com.examly.springapp.dao;

import javax.validation.constraints.NotBlank;

public class OrderTempModel {

    private String OrderId;
    private String userId;

    @NotBlank(message = "Invalid quantity")
    private String bookName;

    @NotBlank(message = "Invalid price")
    private String price;

    @NotBlank(message = "Invalid quantity")
    private String quantity;

    public OrderTempModel() {

    }

    public String getOrderId() {
        return OrderId;
    }

    public void setOrderId(String orderId) {
        this.OrderId = orderId;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
