package com.examly.springapp.service;

import com.examly.springapp.dao.CartTempModel;
import com.examly.springapp.dao.ProductTempModel;
import com.examly.springapp.model.CartModel;
import com.examly.springapp.model.OrderModel;
import com.examly.springapp.model.ProductModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.CartRepository;
import com.examly.springapp.repository.OrderRepository;
import com.examly.springapp.repository.ProductRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
//@Transactional
public class OrderService {
	
	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired
	private CartRepository cartRepository;
	
	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserRepository userRepository;
	
	public List<OrderModel> getUserProducts() {
		String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserModel userModel = userRepository.findByEmail(email);
		return orderRepository.findByUserId(userModel.getUserId());
	}
	
	public List<OrderModel> saveProduct() {
		String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserModel user = userRepository.findByEmail(email);
		//System.out.println("Here");
		//CartModel cart = cartService.findCart(id);
//		UserModel user = userRepository.findByUserId(id);
		if(user==null) {
			System.out.println("NULL");
		}
		CartModel cart = user.getCartModel();
		//CartModel cart = cartRepository.findByCartItemId(id);
//		System.out.println(cart.getCartItemId());
		List<CartTempModel> cartItems = cart.getItems();
		OrderModel tempModel = null;
		List<OrderModel> ordersList = new ArrayList<>();
		for(int i=0; i<cartItems.size(); ++i) {
			CartTempModel cartItem = cartItems.get(i);
			Float totalPrice = Integer.parseInt(cartItem.getQuantity()) * Float.parseFloat(cartItem.getPrice());
			String orderId = user.getUserId() + "_" + i;
			tempModel = new OrderModel(user.getUserId(), cartItem.getProductName(), cartItem.getQuantity(), String.valueOf(totalPrice), "Ordered", cartItem.getPrice());
			orderRepository.save(tempModel);
			user.addItems(tempModel);
			ordersList.add(tempModel);
		}
		//user.setOrdersList(ordersList);
		//cartRepository.delete(cart);
		//CartModel tempCartModel = new CartModel(user.getUserId(), "User Cart", "0", "0.0");
//		cartRepository.save(tempCartModel);
		//user.setCart(tempCartModel);
		cart.setPrice("0.0");
		cart.setProductName("User cart");
		cart.setQuantity("0");
		cart.resetItems();
//		cartRepository.save(cart);
		userRepository.save(user);
		return ordersList;
	}
	
	public List<OrderModel> getAllOrders() {
		return orderRepository.findAll();
	}
	
	public ResponseEntity<?> placeOrder(ProductTempModel productTempModel) {
		String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserModel user = userRepository.findByEmail(email);
		ProductModel productModel = productRepository.findByProductId(productTempModel.getProductId());
//		if(user==null || email==null)
//		System.out.println(user.getEmail());
		Float totalPrice = Integer.parseInt(productModel.getQuantity()) * Float.parseFloat(productModel.getPrice());
//		List<OrderModel> ordersList = orderRepository.findByUserId(user.getUserId());
		OrderModel tempModel = new OrderModel(user.getUserId(), productModel.getProductName(), productModel.getQuantity(), String.valueOf(totalPrice), "Ordered", productModel.getPrice());
		orderRepository.save(tempModel);
		user.addItems(tempModel);
		userRepository.save(user);
		return ResponseEntity.ok().body(tempModel);
	}
}
