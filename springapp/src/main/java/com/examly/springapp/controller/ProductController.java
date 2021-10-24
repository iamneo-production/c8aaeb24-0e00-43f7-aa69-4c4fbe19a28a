package com.examly.springapp.controller;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.model.OrderModel;
import com.examly.springapp.model.ProductModel;
import com.examly.springapp.service.OrderService;
import com.examly.springapp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private RegularAuditService regularAuditService;

    @GetMapping("/admin")
    public List<ProductModel> getProduct() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request for products", email, "", true));
        return productService.getProduct();
    }


    @GetMapping("/home")
    public ResponseEntity<?> getHomeProduct() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request for home products", email, "", true));
        return productService.getHomeProduct();
    }

    @PostMapping("/admin/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody ProductModel productModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request for adding products", email, "", true));
        return productService.productSave(productModel);
    }

    @GetMapping("/admin/delete/{id}")
    public ResponseEntity<?> productDelete(@PathVariable String id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request for deleting products", email, "", true));
        return productService.productDelete(id);
    }

    @GetMapping("/admin/productEdit/{id}")
    public ResponseEntity<?> productEditData(@PathVariable String id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to edit a product", email, "", true));
        return productService.productEditData(id);
    }

    @PostMapping("/admin/productEdit/{id}")
    public ResponseEntity<?> productEditSave(@PathVariable String id, @RequestBody ProductModel productModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to save a product", email, "", true));
        return productService.productEditSave(id, productModel);
    }

    @GetMapping("/admin/orders")
    public List<OrderModel> getAllOrders() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to get all ordered items", email, "", true));
        return orderService.getAllOrders();
    }
}
