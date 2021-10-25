package com.examly.springapp.model;

import com.examly.springapp.converter.StringToFloatConverter;
import com.examly.springapp.converter.StringToIntegerConverter;
import com.examly.springapp.dao.CartTempModel;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.Length;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "carts")
@EntityScan
@Embeddable
@Table(indexes = {
        @Index(name = "idx_cartmodel_cartitemid", columnList = "cartItemId")
})
public class CartModel {


    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")

    @Column(name = "cartItemId")
    @Convert(converter = StringToIntegerConverter.class)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String cartItemId;

    @NotBlank(message = "Product name cannot be blank")
    @Length(message = "Product name must be between 5 to 50 characters", min = 5)
    @NotNull(message = "Product name is mandatory")
    @Column(name = "product_name", columnDefinition = "VARCHAR(50)")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String productName;


    @Convert(converter = StringToIntegerConverter.class)
    @Column(name = "quantity")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Invalid quantity")
    private String quantity;


    @Convert(converter = StringToFloatConverter.class)
    @Column(name = "price")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Invalid price")
    private String price;

    @ElementCollection(targetClass = CartTempModel.class)
    @Column(name = "items")
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Embedded
    private List<CartTempModel> items = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private UserModel userModel;

    public CartModel() {
    }

    public CartModel(String id, String productName, String quantity, String price) {
        super();
        this.cartItemId = id;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }

    public String getCartItemId() {
        return cartItemId;
    }

    public void setCartItemId(String cartItemId) {
        this.cartItemId = cartItemId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public List<CartTempModel> getItems() {
        return items;
    }

    public void setItems(List<CartTempModel> items) {
        this.items = items;
    }

    public UserModel getUserModel() {
        return userModel;
    }

    public void setUserModel(UserModel userModel) {
        this.userModel = userModel;
    }

    public boolean addItem(CartTempModel cartTempModel) {
        for (int i = 0; i < items.size(); ++i) {
            if (items.get(i).getProductName().equals(cartTempModel.getProductName())) {
                return false;
            }
        }
        items.add(cartTempModel);
        return true;
    }

    public boolean removeItem(String name) {
        return items.removeIf(cartItem -> cartItem.getProductName().equals(name));
    }

    public void resetItems() {
        items.clear();
    }

}
