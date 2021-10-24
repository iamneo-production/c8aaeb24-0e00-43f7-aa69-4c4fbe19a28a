package com.examly.springapp.model;

import com.examly.springapp.converter.StringToFloatConverter;
import com.examly.springapp.converter.StringToIntegerConverter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Embeddable
@Table(name = "products", indexes = {
        @Index(name = "idx_productmodel_productid", columnList = "productId")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_productmodel_productid", columnNames = {"productId", "productName"})
})
public class ProductModel {


    @Id

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Convert(converter = StringToIntegerConverter.class)
    private String productId;
    private String imageUrl = "https://media.istockphoto.com/vectors/open-book-top-view-icon-logo-vector-id1217261353?k=20&m=1217261353&s=612x612&w=0&h=11IDdaTrRDu3Ct2rZCcFQ8MSeJLOG3aD8wyRiOxk_vg=";

    @NotBlank(message = "Product name is mandatory")
    private String productName;

    @Convert(converter = StringToFloatConverter.class)
    @NotBlank(message = "Price is mandatory")
    private String price;

    @Column(length = 2000)
    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotBlank(message = "Quantity is mandatory")
    @Convert(converter = StringToIntegerConverter.class)
    private String quantity;

    public ProductModel() {

    }

    public ProductModel(String productId, String imageUrl, String productName, String price, String description,
                        String quantity) {
        super();
        this.productId = productId;
        if (imageUrl.equals("") || imageUrl == null)
            this.imageUrl = "https://media.istockphoto.com/vectors/open-book-top-view-icon-logo-vector-id1217261353?k=20&m=1217261353&s=612x612&w=0&h=11IDdaTrRDu3Ct2rZCcFQ8MSeJLOG3aD8wyRiOxk_vg=";
        else {
            this.imageUrl = imageUrl;
        }
        this.productName = productName;
        this.price = price;
        this.description = description;
        this.quantity = quantity;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }
}
