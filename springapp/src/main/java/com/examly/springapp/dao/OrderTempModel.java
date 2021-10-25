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
}
