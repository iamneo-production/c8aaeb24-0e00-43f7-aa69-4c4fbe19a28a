package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.exception.PriceInvalidException;
import com.examly.springapp.exception.QuantityInvalidException;
import com.examly.springapp.model.ProductModel;
import com.examly.springapp.repository.ProductRepository;
import com.examly.springapp.response.ApiResponse;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.validation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.examly.springapp.service.CartService.checkNumber;
import static com.examly.springapp.service.CartService.checkNumberFloat;
import static org.springframework.http.HttpStatus.*;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RegularAuditService regularAuditService;

    public List<ProductModel> getProduct() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to get all products",  email, "Fetched products from database", true));
        return productRepository.findAll();
    }


    public ResponseEntity<List<ProductModel>> getHomeProduct() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to get home products",  email, "Fetched products from database", true));
        List<ProductModel> products = productRepository.findAll();
        return ResponseEntity.ok().body(products);
    }

    public ResponseEntity<?> productEditData(String id) {
        List<String> errors = new ArrayList<>();
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProductModel product = productRepository.findByProductId(id);
        if (product == null) {
            regularAuditService.audit(new RegularAuditModel("Request to edit product data",  email, "Invalid product id", false));
            errors.add("Invalid id");
            return ResponseEntity.ok().body(new ApiResponse(false, "There is no product for the given id", FORBIDDEN.value(), FORBIDDEN, errors));
        }
        regularAuditService.audit(new RegularAuditModel("Request to edit product data",  email, "Product details fetched", true));
        return ResponseEntity.ok().body(product);
    }

    public ResponseEntity<?> productEditSave(String id, @Valid ProductModel productModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<String> errors = new ArrayList<>();
        ProductModel product = productRepository.findByProductId(id);
        try {
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<ProductModel>> violations = validator.validate(product);
            for (ConstraintViolation<ProductModel> violation : violations) {

                errors.add(violation.getMessage());
            }
            if (errors.size() > 0)
            {
                regularAuditService.audit(new RegularAuditModel("Request to save edited product",  email, "Validation failed", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "Invalid data entered", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
            }
        } catch (ConstraintViolationException e) {
            regularAuditService.audit(new RegularAuditModel("Request to save edited product",  email, "Constraint error was caused", false));
            errors.add(e.getMessage());
            return ResponseEntity.ok().body(new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        String quantity = productModel.getQuantity();
        if (!checkNumber(quantity) || quantity == null || quantity == "") throw new QuantityInvalidException();
        String price = productModel.getPrice();
        if (!checkNumberFloat(price) || price == null || price == "") throw new PriceInvalidException();
        if (product == null) {
            errors.add("Invalid product id");
            regularAuditService.audit(new RegularAuditModel("Request to save edited product data",  email, "Invalid product id", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "There is no product for the given id", FORBIDDEN.value(), FORBIDDEN, errors));
        }
        product.setProductName(productModel.getProductName());
        product.setDescription(productModel.getDescription());
        product.setImageUrl(productModel.getImageUrl());
        product.setPrice(productModel.getPrice());
        product.setQuantity(productModel.getQuantity());
        productRepository.save(product);
        regularAuditService.audit(new RegularAuditModel("Request to save edited product",  email, "Product details saved", true));
        return ResponseEntity.ok().body(new ApiResponse(true, "The product has been edited", OK.value(), OK, errors));
    }

    public ResponseEntity<?> productSave(@Valid ProductModel data) {
        List<String> errors = new ArrayList<>();
        try {
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<ProductModel>> violations = validator.validate(data);
            for (ConstraintViolation<ProductModel> violation : violations) {

                errors.add(violation.getMessage());
            }
            if (errors.size() > 0)
            {
                regularAuditService.audit(new RegularAuditModel("Request to save product",  "", "Validation failed", false));
                return new ResponseEntity<Object>(new ApiResponse(false, "Invalid data entered", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), HttpStatus.OK);
            }
        } catch (ConstraintViolationException e) {
            regularAuditService.audit(new RegularAuditModel("Request to save product",  "", "Constraint error was caused", false));
            errors.add(e.getMessage());
            return new ResponseEntity<Object>(new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), HttpStatus.OK);
        }
        if(data.getProductName() == "" || data.getProductName() == null) {
            errors.add("Invalid product name");
            return ResponseEntity.ok().body(new ApiResponse(false, "Invalid product name", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        String quantity = data.getQuantity();
        if (!checkNumber(quantity) || quantity == null || quantity == "") throw new QuantityInvalidException();
        String price = data.getPrice();
        if (!checkNumberFloat(price) || price == null || price == "") throw new PriceInvalidException();
        ProductModel productModel = productRepository.save(data);
        if (productModel == null) {
            errors.add("Saving product unsuccessful");
            regularAuditService.audit(new RegularAuditModel("Request to save product",  "", "Invalid product id", false));
            return new ResponseEntity<Object>(new ApiResponse(false, "There was an unknown error during saving the product", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), HttpStatus.OK);
        }
        regularAuditService.audit(new RegularAuditModel("Request to save product",  "", "Product added to database", true));
        return new ResponseEntity<Object>(new ApiResponse(true, "Product has been added to the database", OK.value(), OK, errors), HttpStatus.OK);
    }

    public ResponseEntity<?> productDelete(String id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<String> errors = new ArrayList<>();
        ProductModel product = productRepository.findByProductId(id);
        if (product == null) {
            errors.add("Invalid product id");
            regularAuditService.audit(new RegularAuditModel("Request to delete product",  email, "Invalid product id", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "There is no product for the given id", FORBIDDEN.value(), FORBIDDEN, errors));
        }
        productRepository.delete(product);
        regularAuditService.audit(new RegularAuditModel("Request to delete product",  email, "Product is delete from database", true));
        return ResponseEntity.ok().body(new ApiResponse(true, "The product has been deleted.", OK.value(), OK, errors));
    }

}
