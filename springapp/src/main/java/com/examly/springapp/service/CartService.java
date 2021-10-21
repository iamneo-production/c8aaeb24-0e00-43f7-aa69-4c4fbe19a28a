package com.examly.springapp.service;

import com.examly.springapp.dao.CartTempModel;
import com.examly.springapp.dao.ProductTempModel;
import com.examly.springapp.exception.IdInvalidException;
import com.examly.springapp.exception.QuantityInvalidException;
import com.examly.springapp.model.CartModel;
import com.examly.springapp.model.ProductModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.CartRepository;
import com.examly.springapp.repository.ProductRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.validation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.springframework.http.HttpStatus.*;

@Service
public class CartService {

	@Autowired
	public CartRepository cartRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserRepository userRepository;
	
	//@GetMapping("/cart")
	public List<CartModel> getAll() {
		return cartRepository.findAll();
	}
	
	//@PostMapping("/cart")
	public ResponseEntity<Object> addCart(@Valid CartModel cart) {
		CartModel cartModel = cartRepository.findByCartItemId(cart.getCartItemId());
		List<String> errors = new ArrayList<>();
		if(cartModel != null) {
			errors.add("Cart Already Exists");
			//return new ResponseEntity<Object>(new ApiError("Cart Already Exists", HttpStatus.NOT_ACCEPTABLE, "Error", 102, 406), HttpStatus.NOT_ACCEPTABLE);
			return new ResponseEntity<Object>(new ApiResponse(false, "Cart Already Exists", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), HttpStatus.OK);
		}
		try {
			ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
			Validator validator = factory.getValidator();
			Set<ConstraintViolation<CartModel>> violations = validator.validate(cart);
			//List<String> errors = new ArrayList<>();
			for (ConstraintViolation<CartModel> violation: violations) {
				System.out.print(violation.getMessage());
				//return new ResponseEntity<Object>(new ApiError(violation.getMessage(), HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.NOT_ACCEPTABLE);
				//return false;
				errors.add(violation.getMessage());
			}
			if(errors.size()>0)
				return new ResponseEntity<Object>(new ApiResponse(false, "Validation failed", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), HttpStatus.OK);
		}
		catch(ConstraintViolationException e) {
			//return new ResponseEntity<Object>(new ApiError(e.getMessage(), HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.NOT_ACCEPTABLE);
			//return false;
			//List<String> errors = new ArrayList<>();
			errors.add(e.getMessage());
			return new ResponseEntity<Object>(new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), HttpStatus.OK);
		}
		try {
			cartRepository.save(cart);
		}
		catch(DataIntegrityViolationException e) {
			if(e.getMessage().contains("constraint")) {
				//return new ResponseEntity<Object>(new ApiError("Constraint Error", HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.NOT_ACCEPTABLE);
				//return false;
				errors.add(e.getMessage());
				return new ResponseEntity<Object>(new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), HttpStatus.OK);
			}
		}
		//return new ResponseEntity<Object>(new ApiSuccess("Cart created", HttpStatus.OK, 200, true), HttpStatus.OK);
		//return false;
		return new ResponseEntity<Object>(new ApiResponse(true, "Cart created", OK.value(), OK, errors), HttpStatus.OK);
	}
	
	public ResponseEntity<?> findCart (String id) {
		String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserModel userModel = userRepository.findByEmail(email);
		CartModel cartModel = userModel.getCartModel();
		return ResponseEntity.ok().body(cartModel.getItems());
	}
	
	public ResponseEntity<?> addProduct(String id, ProductTempModel productTempModel) {
		List<String> errors = new ArrayList<>();
		String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserModel userModel = userRepository.findByUserId(id);
		String quantity = productTempModel.getQuantity();
		if( !checkNumber(quantity) || quantity==null || quantity=="") throw new QuantityInvalidException();
		try {
			if (userModel == null) {
				errors.add("Invalid user id ");
				return new ResponseEntity<Object>(new ApiResponse(false, "No user found for the given user id", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
			if(!email.equals(userModel.getEmail())) {
				errors.add("Invalid request for this user");
				return new ResponseEntity<Object>(new ApiResponse(false, "You are not allowed to perform this action for this user id", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
			CartModel cartModel = userModel.getCartModel();
			if (cartModel == null) {
				errors.add("Failed to fetch the cart");
				return new ResponseEntity<Object>(new ApiResponse(false, "No cart found for the given user id", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
			ProductModel productModel = productRepository.findByProductId(productTempModel.getProductId());
			if (productModel == null) {
				errors.add("Invalid product id");
				return new ResponseEntity<Object>(new ApiResponse(false, "No product found for the given product id", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
			Integer productStock = Integer.parseInt(productModel.getQuantity());
			Integer cartStockRequired = Integer.parseInt(productTempModel.getQuantity());
			if(productStock < cartStockRequired) {
				errors.add("Insufficient stock for this product");
				return new ResponseEntity<Object>(new ApiResponse(false, "There is few stock for this product than requested, only " + productStock + " are available", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
			CartTempModel cartTempModel = new CartTempModel(productModel.getProductId(), productModel.getProductName(), productModel.getPrice(), productTempModel.getQuantity());
			cartModel.addItem(cartTempModel);
			cartRepository.save(cartModel);
			return new ResponseEntity<Object>(productModel, OK);
		}
		catch (Exception e) {
			errors.add("Unknown error");
			return new ResponseEntity<Object>(new ApiResponse(false, e.getLocalizedMessage(), FORBIDDEN.value(), FORBIDDEN, errors), OK);
		}
	}

	public ResponseEntity<?> deleteCartItem(String email, ProductTempModel productTempModel) {
		String quantity = productTempModel.getQuantity();
		if( !checkNumber(quantity) || quantity==null || quantity=="") throw new QuantityInvalidException();
		List<String> errors = new ArrayList<>();
		try {
			UserModel userModel = userRepository.findByEmail(email);
			if (userModel == null) {
				errors.add("Invalid user id ");
				return new ResponseEntity<Object>(new ApiResponse(false, "No user found for the given user id", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
			CartModel cartModel = userModel.getCartModel();
			if (cartModel == null) {
				errors.add("Failed to fetch the cart");
				return new ResponseEntity<Object>(new ApiResponse(false, "No cart found for the given user id", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
			ProductModel productModel = productRepository.findByProductId(productTempModel.getProductId());
			if (productModel == null) {
				errors.add("Invalid product id");
				return new ResponseEntity<Object>(new ApiResponse(false, "No product found for the given product id", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
			if(cartModel.removeItem(productModel.getProductName())) {
				return new ResponseEntity<Object>(new ApiResponse(true, "Item removed from the cart.", OK.value(), OK, errors), OK);
			}
			else {
				errors.add("Not found");
				return new ResponseEntity<Object>(new ApiResponse(false, "Item not found in the cart", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
		}
		catch (Exception e) {
			errors.add("Unknown error");
			return new ResponseEntity<Object>(new ApiResponse(false, e.getLocalizedMessage(), FORBIDDEN.value(), FORBIDDEN, errors), OK);
		}
	}

	public static boolean checkNumber(String number) {
		return number.chars().allMatch(Character :: isDigit);
	}

	public static boolean checkNumberFloat(String str) {
		return str.matches("[-+]?[0-9]*\\.?[0-9]+");
	}
}
