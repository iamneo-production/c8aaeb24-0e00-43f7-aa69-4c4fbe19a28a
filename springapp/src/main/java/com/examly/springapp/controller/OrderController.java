package com.examly.springapp.controller;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.dao.ProductTempModel;
import com.examly.springapp.model.OrderModel;
import com.examly.springapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private RegularAuditService regularAuditService;

    @GetMapping("/orders")
    public List<OrderModel> getUserProducts() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request for ordered items", email, "", true));
        return orderService.getUserProducts();
    }

    @GetMapping("/saveOrder")
    public List<OrderModel> saveOrder() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to save order", email, "", true));
        return orderService.saveProduct();

    }

    @PostMapping("/placeOrder")
    public ResponseEntity<?> placeOrder(@RequestBody ProductTempModel productTempModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to place order", email, "", true));
        return orderService.placeOrder(productTempModel);
    }
}
