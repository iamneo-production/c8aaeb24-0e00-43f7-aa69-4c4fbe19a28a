package com.examly.springapp.controller;

import com.examly.springapp.dao.ProductTempModel;
import com.examly.springapp.model.OrderModel;
import com.examly.springapp.model.ProductModel;
import com.examly.springapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController {
	
	@Autowired
	private OrderService orderService;
	
	@GetMapping("/orders")
	public List<OrderModel> getUserProducts() {
		return orderService.getUserProducts();
	}
	
	@GetMapping("/saveOrder")
	public List<OrderModel> saveOrder() {
		return orderService.saveProduct();
		
	}
	
	@PostMapping("/placeOrder")
	public ResponseEntity<?> placeOrder(@RequestBody ProductTempModel productTempModel) {
		return orderService.placeOrder(productTempModel);
	}
}
