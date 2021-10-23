package com.examly.springapp.controller;

import com.examly.springapp.model.OrderModel;
import com.examly.springapp.model.ProductModel;
import com.examly.springapp.service.OrderService;
import com.examly.springapp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {
	
	@Autowired
	private ProductService productService;
	
	@Autowired
	private OrderService orderService;
	
	@GetMapping("/admin")
	public List<ProductModel> getProduct() {
		return productService.getProduct();
	}
	
	//Verified
	@GetMapping("/home")
	public ResponseEntity<?> getHomeProduct() {
		return productService.getHomeProduct();
	}
	
	@PostMapping("/admin/addProduct")
	public ResponseEntity<?> addProduct(@RequestBody ProductModel productModel) {
		System.out.println(productModel.getImageUrl());
		return productService.productSave(productModel);
	}
	
	@GetMapping("/admin/delete/{id}")
	public ResponseEntity<?> productDelete(@PathVariable String id) {
		return productService.productDelete(id);
	}
	
	@GetMapping("/admin/productEdit/{id}")
	public ResponseEntity<?> productEditData(@PathVariable String id) {
		return productService.productEditData(id);
	}
	
	@PostMapping("/admin/productEdit/{id}")
	public ResponseEntity<?> productEditSave(@PathVariable String id, @RequestBody ProductModel productModel) {
		return productService.productEditSave(id, productModel);
	}
	
	@GetMapping("/admin/orders")
	public List<OrderModel> getAllOrders() {
		return orderService.getAllOrders();
	}
}
