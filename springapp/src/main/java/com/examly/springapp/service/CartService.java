package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.dao.CartTempModel;
import com.examly.springapp.dao.ProductTempModel;
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

    @Autowired
    private RegularAuditService regularAuditService;

    public static boolean checkNumber(String number) {
        return number.chars().allMatch(Character::isDigit);
    }

    public static boolean checkNumberFloat(String str) {
        return str.matches("[-+]?[0-9]*\\.?[0-9]+");
    }

    public List<CartModel> getAll() {
        return cartRepository.findAll();
    }

    public ResponseEntity<Object> addCart(@Valid CartModel cart) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to add new cart", email, "", true));
        CartModel cartModel = cartRepository.findByCartItemId(cart.getCartItemId());
        List<String> errors = new ArrayList<>();
        if (cartModel != null) {
            errors.add("Cart Already Exists");
            regularAuditService
                    .audit(new RegularAuditModel("Request to add new cart", email, "Cart already exists", false));
            return new ResponseEntity<Object>(
                    new ApiResponse(false, "Cart Already Exists", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors),
                    HttpStatus.OK);
        }
        try {
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<CartModel>> violations = validator.validate(cart);
            for (ConstraintViolation<CartModel> violation : violations) {

                errors.add(violation.getMessage());
            }
            if (errors.size() > 0) {
                regularAuditService
                        .audit(new RegularAuditModel("Request to add new cart", email, "Validation failed", false));
                return new ResponseEntity<Object>(
                        new ApiResponse(false, "Validation failed", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors),
                        HttpStatus.OK);
            }
        } catch (ConstraintViolationException e) {
            regularAuditService.audit(
                    new RegularAuditModel("Request to add new cart", email, "Constraint error was caused", false));
            errors.add(e.getMessage());
            return new ResponseEntity<Object>(
                    new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors),
                    HttpStatus.OK);
        }
        try {
            regularAuditService
                    .audit(new RegularAuditModel("Request to add new cart", email, "Attempting to save", true));
            cartRepository.save(cart);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage().contains("constraint")) {
                regularAuditService.audit(new RegularAuditModel("Request to add new cart", email,
                        "Constraint error was caused while adding", false));
                errors.add(e.getMessage());
                return new ResponseEntity<Object>(
                        new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors),
                        HttpStatus.OK);
            }
        }

        return new ResponseEntity<Object>(new ApiResponse(true, "Cart created", OK.value(), OK, errors), HttpStatus.OK);
    }

    public ResponseEntity<?> findCart(String id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel userModel = userRepository.findByEmail(email);
        CartModel cartModel = userModel.getCartModel();
        regularAuditService.audit(new RegularAuditModel("Request to find cart", email, "", true));
        return ResponseEntity.ok().body(cartModel.getItems());
    }

    public ResponseEntity<?> addProduct(String id, @Valid ProductTempModel productTempModel) {
        List<String> errors = new ArrayList<>();
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel userModel = userRepository.findByUserId(id);
        try {
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<ProductTempModel>> violations = validator.validate(productTempModel);
            for (ConstraintViolation<ProductTempModel> violation : violations) {

                errors.add(violation.getMessage());
            }
            if (errors.size() > 0) {
                regularAuditService
                        .audit(new RegularAuditModel("Request to add product", email, "Validation failed", false));
                return ResponseEntity.ok().body(
                        new ApiResponse(false, "Invalid data entered", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
            }
        } catch (ConstraintViolationException e) {
            regularAuditService.audit(
                    new RegularAuditModel("Request to add new cart", email, "Constraint error was caused", false));
            errors.add(e.getMessage());
            return ResponseEntity.ok()
                    .body(new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        String quantity = productTempModel.getQuantity();
        regularAuditService.audit(new RegularAuditModel("Request to add product to cart", email, "", true));
        if (!checkNumber(quantity) || quantity == null || quantity == "")
            throw new QuantityInvalidException();
        try {
            if (userModel == null) {
                errors.add("Invalid user id ");
                regularAuditService
                        .audit(new RegularAuditModel("Request to add product to cart", email, "User not found", false));
                return new ResponseEntity<Object>(new ApiResponse(false, "No user found for the given user id",
                        FORBIDDEN.value(), FORBIDDEN, errors), OK);
            }
            if (!email.equals(userModel.getEmail())) {
                errors.add("Invalid request for this user");
                regularAuditService.audit(new RegularAuditModel("Request to add product to cart", email,
                        "Invalid request for this user", false));
                return new ResponseEntity<Object>(
                        new ApiResponse(false, "You are not allowed to perform this action for this user id",
                                FORBIDDEN.value(), FORBIDDEN, errors),
                        OK);
            }
            CartModel cartModel = userModel.getCartModel();
            if (cartModel == null) {
                errors.add("Failed to fetch the cart");
                regularAuditService.audit(new RegularAuditModel("Request to add product to cart", email,
                        "Failed to fetch the cart", false));
                return new ResponseEntity<Object>(new ApiResponse(false, "No cart found for the given user id",
                        FORBIDDEN.value(), FORBIDDEN, errors), OK);
            }
            ProductModel productModel = productRepository.findByProductId(productTempModel.getProductId());
            if (productModel == null) {
                errors.add("Invalid product id");
                regularAuditService.audit(new RegularAuditModel("Request to add product to cart", email,
                        "Invalid product id given", false));
                return new ResponseEntity<Object>(new ApiResponse(false, "No product found for the given product id",
                        FORBIDDEN.value(), FORBIDDEN, errors), OK);
            }
            Integer productStock = Integer.parseInt(productModel.getQuantity());
            Integer cartStockRequired = Integer.parseInt(productTempModel.getQuantity());
            if (productStock < cartStockRequired) {
                regularAuditService.audit(
                        new RegularAuditModel("Request to add product to cart", email, "Insufficent stock", false));
                errors.add("Insufficient stock for this product");
                return new ResponseEntity<Object>(new ApiResponse(false,
                        "There is few stock for this product than requested, only " + productStock + " are available",
                        FORBIDDEN.value(), FORBIDDEN, errors), OK);
            }
            CartTempModel cartTempModel = new CartTempModel(productModel.getProductId(), productModel.getProductName(),
                    productModel.getPrice(), productTempModel.getQuantity());
            cartModel.addItem(cartTempModel);
            cartRepository.save(cartModel);
            regularAuditService.audit(
                    new RegularAuditModel("Request to add product to cart", email, "Product added to cart", true));
            return ResponseEntity.ok()
                    .body(new ApiResponse(true, "Item has been added to cart", OK.value(), OK, errors));
        } catch (Exception e) {
            errors.add("Unknown error");
            regularAuditService.audit(
                    new RegularAuditModel("Request to add product to cart", email, "Unknown error occurred", false));
            return new ResponseEntity<Object>(
                    new ApiResponse(false, e.getLocalizedMessage(), FORBIDDEN.value(), FORBIDDEN, errors), OK);
        }
    }

    public ResponseEntity<?> deleteCartItem(String email, @Valid ProductTempModel productTempModel) {
        List<String> errors = new ArrayList<>();
        String quantity = productTempModel.getQuantity();
        regularAuditService.audit(new RegularAuditModel("Request to delete product from cart", email, "", true));
        try {
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<ProductTempModel>> violations = validator.validate(productTempModel);
            for (ConstraintViolation<ProductTempModel> violation : violations) {

                errors.add(violation.getMessage());
            }
            if (errors.size() > 0) {
                regularAuditService
                        .audit(new RegularAuditModel("Request to delete cart item", email, "Validation failed", false));
                return ResponseEntity.ok().body(
                        new ApiResponse(false, "Invalid data entered", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
            }
        } catch (ConstraintViolationException e) {
            regularAuditService.audit(
                    new RegularAuditModel("Request to add new cart", email, "Constraint error was caused", false));
            errors.add(e.getMessage());
            return ResponseEntity.ok()
                    .body(new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        if (!checkNumber(quantity) || quantity == null || quantity == "")
            throw new QuantityInvalidException();
        try {
            UserModel userModel = userRepository.findByEmail(email);
            if (userModel == null) {
                errors.add("Invalid user id ");
                regularAuditService.audit(
                        new RegularAuditModel("Request to delete product from cart", email, "Invalid user id", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "No user found for the given user id",
                        FORBIDDEN.value(), FORBIDDEN, errors));
            }
            CartModel cartModel = userModel.getCartModel();
            if (cartModel == null) {
                errors.add("Failed to fetch the cart");
                regularAuditService.audit(new RegularAuditModel("Request to delete product from cart", email,
                        "Failed to fetch cart", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "No cart found for the given user id",
                        FORBIDDEN.value(), FORBIDDEN, errors));
            }
            ProductModel productModel = productRepository.findByProductId(productTempModel.getProductId());
            if (productModel == null) {
                errors.add("Invalid product id");
                regularAuditService.audit(new RegularAuditModel("Request to delete product from cart", email,
                        "Invalid product id", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "No product found for the given product id",
                        FORBIDDEN.value(), FORBIDDEN, errors));
            }
            if (cartModel.removeItem(productModel.getProductName())) {
                regularAuditService.audit(new RegularAuditModel("Request to delete product from cart", email,
                        "Item was deleted from the cart", true));
                return ResponseEntity.ok()
                        .body(new ApiResponse(true, "Item removed from the cart.", OK.value(), OK, errors));
            } else {
                errors.add("Not found");
                regularAuditService
                        .audit(new RegularAuditModel("Request to delete product from cart", email, "Not found", false));
                return ResponseEntity.ok().body(
                        new ApiResponse(false, "Item not found in the cart", FORBIDDEN.value(), FORBIDDEN, errors));
            }
        } catch (Exception e) {
            errors.add("Unknown error");
            regularAuditService
                    .audit(new RegularAuditModel("Request to delete product from cart", email, "Unknown error", false));
            return ResponseEntity.ok()
                    .body(new ApiResponse(false, e.getLocalizedMessage(), FORBIDDEN.value(), FORBIDDEN, errors));
        }
    }
}
