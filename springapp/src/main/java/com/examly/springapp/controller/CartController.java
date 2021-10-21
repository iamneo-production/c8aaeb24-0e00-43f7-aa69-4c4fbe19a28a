package com.examly.springapp.controller;

import com.examly.springapp.dao.CartTempModel;
import com.examly.springapp.dao.ProductTempModel;
import com.examly.springapp.model.CartModel;
import com.examly.springapp.model.ProductModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

@Transactional
@RestController
public class CartController {
	
	@Autowired
	public CartService cartService;
	
	@RequestMapping(method=RequestMethod.POST, value="/home/{id}")
	public ResponseEntity<?> addToCart(String quantity, @PathVariable String id, @RequestBody ProductTempModel productTempModel) {
		//List<CartModel> cartModel = cartService.findCart(id);
		return cartService.addProduct(id, productTempModel);
		//return cartService.addCart(cart);
		//return cartService.addToCart(quantity, id, productModel);
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/cart/{id}")
	public ResponseEntity<?> showCart(@PathVariable String id){
		return cartService.findCart(id);
	}
	
	@RequestMapping(method=RequestMethod.POST, value="/cart/delete")
	public ResponseEntity<?> deleteCartItem(@RequestBody ProductTempModel productTempModel) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return cartService.deleteCartItem(username, productTempModel);
		//if( !checkNumber(id) || id==null || id=="") throw new IdInvalidException();
		
	}
	
	public static boolean checkNumber(String number) {
		return number.chars().allMatch(Character :: isDigit);
	}
	
//	@GetMapping("/cart")
//	public List<CartModel> getAll() {
//		return cartService.getAll();
//	}
//	
//	@PostMapping("/cart")
//	public ResponseEntity<Object> add(@RequestBody CartModel cart) {
//		return cartService.addCart(cart);
//	}
}