package com.examly.springapp.controller;

import com.examly.springapp.model.PaymentModel;
import com.examly.springapp.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/user/pay")
    public ResponseEntity<?> savePayment(@RequestBody PaymentModel paymentModel) {
        return paymentService.savePayment(paymentModel);
    }

    @GetMapping("/user/pay")
    public ResponseEntity<?> get() {
        return ResponseEntity.ok().body(true);
    }
}
