package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.exception.PriceInvalidException;
import com.examly.springapp.exception.QuantityInvalidException;
import com.examly.springapp.model.ProductModel;
import com.examly.springapp.repository.ProductRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.examly.springapp.service.CartService.checkNumber;
import static com.examly.springapp.service.CartService.checkNumberFloat;
import static org.springframework.http.HttpStatus.*;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRespository;

    @Autowired
    private RegularAuditService regularAuditService;

    public List<ProductModel> getProduct() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to add new cart",  email, "Fetched products from database", true));
        return productRespository.findAll();
    }


    public ResponseEntity<List<ProductModel>> getHomeProduct() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to get home products",  email, "Fetched products from database", true));
        List<ProductModel> products = productRespository.findAll();
        return ResponseEntity.ok().body(products);
    }

    public ResponseEntity<?> productEditData(String id) {
        List<String> errors = new ArrayList<>();
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProductModel product = productRespository.findByProductId(id);
        if (product == null) {
            regularAuditService.audit(new RegularAuditModel("Request to edit product data",  email, "Invalid product id", false));
            errors.add("Invalid id");
            return ResponseEntity.ok().body(new ApiResponse(false, "There is no product for the given id", FORBIDDEN.value(), FORBIDDEN, errors));
        }
        regularAuditService.audit(new RegularAuditModel("Request to edit product",  email, "Product details fetched", true));
        return ResponseEntity.ok().body(product);
    }

    public ResponseEntity<?> productEditSave(String id, ProductModel productModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String quantity = productModel.getQuantity();
        if (!checkNumber(quantity) || quantity == null || quantity == "") throw new QuantityInvalidException();
        String price = productModel.getPrice();
        if (!checkNumberFloat(price) || price == null || price == "") throw new PriceInvalidException();
        List<String> errors = new ArrayList<>();
        ProductModel product = productRespository.findByProductId(id);
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
        productRespository.save(product);
        regularAuditService.audit(new RegularAuditModel("Request to save edited product",  email, "Product details saved", true));
        return ResponseEntity.ok().body(new ApiResponse(true, "The product has been edited", OK.value(), OK, errors));
    }

    public ResponseEntity<?> productSave(ProductModel data) {
        List<String> errors = new ArrayList<>();
        ProductModel productModel = productRespository.save(data);
        if (productModel == null) {
            errors.add("Saving product unsuccessful");
            regularAuditService.audit(new RegularAuditModel("Request to add product",  "", "Invalid product id", false));
            return new ResponseEntity<Object>(new ApiResponse(false, "There was an unknown error during saving the product", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), HttpStatus.OK);
        }
        regularAuditService.audit(new RegularAuditModel("Request to add product",  "", "Product added to database", true));
        return new ResponseEntity<Object>(new ApiResponse(true, "Product has been added to the database", OK.value(), OK, errors), HttpStatus.OK);
    }

    public ResponseEntity<?> productDelete(String id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<String> errors = new ArrayList<>();
        ProductModel product = productRespository.findByProductId(id);
        if (product == null) {
            errors.add("Invalid product id");
            regularAuditService.audit(new RegularAuditModel("Request to delete product",  email, "Invalid product id", false));
            return ResponseEntity.ok().body(new ApiResponse(false, "There is no product for the given id", FORBIDDEN.value(), FORBIDDEN, errors));
        }
        productRespository.delete(product);
        regularAuditService.audit(new RegularAuditModel("Request to delete product",  email, "Product is delete from database", true));
        return ResponseEntity.ok().body(new ApiResponse(true, "The product has been deleted.", OK.value(), OK, errors));
    }

}
