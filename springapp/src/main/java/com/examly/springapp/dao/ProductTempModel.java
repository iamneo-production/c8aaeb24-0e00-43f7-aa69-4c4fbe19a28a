package com.examly.springapp.dao;

import javax.validation.constraints.NotBlank;

public class ProductTempModel {

    @NotBlank(message = "Invalid product id")
    private String productId;

    @NotBlank(message = "Invalid quantity")
    private String quantity;


    public ProductTempModel() {

    }

    public ProductTempModel(String productId, String quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }
}
