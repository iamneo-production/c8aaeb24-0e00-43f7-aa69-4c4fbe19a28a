package com.examly.springapp.model;


import com.examly.springapp.dao.CartTempModel;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@EntityScan
@Table(name = "users", uniqueConstraints = {
		@UniqueConstraint(name = "uc_usermodel_userid_email", columnNames = {"userId", "email"})
})
public class UserModel {
	
//	@Id
//	@GeneratedValue(strategy = GenerationType.AUTO)
//	private int id;

	@Id
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid", strategy = "uuid")
	private String userId;
	
	@Email(message = "Email address is invalid")
	@NotBlank(message = "Email is required")
	private String email;

	@Column(columnDefinition = "VARCHAR(100)")
	@NotBlank(message = "Password is required")
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	//@Size(min = 5, max = 16, message = "Password length must be between 8 and 16")
	private String password;
	
	@NotBlank(message = "Username is mandatory")
	@Size(min = 5, max = 30, message = "Username must be between 5 and 30")
	private String username;
	
	@NotBlank(message = "Mobile number is mandatory")
	@Size(min = 10, max = 10, message = "Invalid mobile number")
	private String mobileNumber;
	
	private boolean active = true;
	
	//@NotBlank
	private String role;

	@ElementCollection(targetClass = OrderModel.class)
	@Column(name = "items")
	@OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
	@Embedded
	private List<OrderModel> ordersList = new ArrayList<>();

	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "cart_item_id")
	@Embedded
	private CartModel cartModel;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private boolean mfa;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String secret;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private boolean verifiedForTOTP;

	@Column(length = 100)
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String forgotCode;

	public String getForgotCode() {
		return forgotCode;
	}

	public CartModel getCartModel() {
		return cartModel;
	}

	public void setCartModel(CartModel cartModel) {
		this.cartModel = cartModel;
	}

	public UserModel() {
		
	}

	public UserModel(String userId, String email, String password, String username, String mobileNumber, boolean active, String role,
			CartModel cartModel, List<OrderModel> ordersList, boolean mfa, String secret) {
		super();
		this.userId = userId;
		this.email = email;
		this.password = password;
		this.username = username;
		this.mobileNumber = mobileNumber;
		this.active = active;
		this.role = role;
		//System.out.println("Checking after signup: " + this.role + " " + role);
		this.cartModel = cartModel;
		//this.cart.setUserId(String.valueOf(id));
		this.ordersList = ordersList;
		this.mfa = mfa;
		this.secret = secret;
		//this.cart.setCartItemId(String.valueOf(id));
	}

		
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
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

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public List<OrderModel> getOrdersList() {
		return ordersList;
	}

	public void setOrdersList(List<OrderModel> ordersList) {
		this.ordersList = ordersList;
	}

	public boolean isMfa() {
		return mfa;
	}

	public void setMfa(boolean mfa) {
		this.mfa = mfa;
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public boolean isVerifiedForTOTP() {
		return verifiedForTOTP;
	}

	public void setVerifiedForTOTP(boolean verifiedForTOTP) {
		this.verifiedForTOTP = verifiedForTOTP;
	}

	public void setForgotCode(String forgotCode) {
		this.forgotCode = forgotCode;
	}

	public void addItems(OrderModel orderModel) {
		ordersList.add(orderModel);
	}
	
}
