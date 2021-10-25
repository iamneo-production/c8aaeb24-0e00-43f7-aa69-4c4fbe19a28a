package com.examly.springapp.model;

import com.examly.springapp.converter.StringToFloatConverter;
import com.examly.springapp.converter.StringToIntegerConverter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Embeddable
public class OrderModel {


    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String orderId;

    private String userId;

    @NotBlank(message = "Invalid product name")
    private String productName;

    @Convert(converter = StringToIntegerConverter.class)
    @NotBlank(message = "Invalid quantity")
    private String quantity;

    @Convert(converter = StringToFloatConverter.class)
    @NotBlank(message = "Invalid total price")
    private String totalPrice;
    private String status;

    @Convert(converter = StringToFloatConverter.class)
    @NotBlank(message = "Invalid price")
    private String price;

    public OrderModel() {

    }

    public OrderModel(String userId, String productName, String quantity, String totalPrice, String status,
                      String price) {
        super();

        this.userId = userId;
        this.productName = productName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.price = price;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProdcutName() {
        return productName;
    }

    public void setProdcutName(String productName) {
        this.productName = productName;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

}
