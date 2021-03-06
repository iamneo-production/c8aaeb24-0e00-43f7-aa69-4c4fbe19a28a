package com.examly.springapp.dao;

import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

@Entity
@Embeddable
public class CartTempModel {

    @Id
    private String productId;

    @NotBlank(message = "Invalid product name")
    private String productName;

    @NotBlank(message = "Invalid price")
    private String price;

    @NotBlank(message = "Invalid quantity")
    private String quantity;

    public CartTempModel() {

    }

    public CartTempModel(String productId, String productName, String price, String quantity) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }
}
