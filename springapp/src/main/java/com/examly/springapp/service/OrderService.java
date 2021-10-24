package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
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

import java.util.ArrayList;
import java.util.List;

@Service

public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RegularAuditService regularAuditService;

    public List<OrderModel> getUserProducts() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel userModel = userRepository.findByEmail(email);
        regularAuditService.audit(new RegularAuditModel("Request to get home products",  email, "", true));
        return orderRepository.findByUserId(userModel.getUserId());
    }

    public List<OrderModel> saveProduct() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel user = userRepository.findByEmail(email);
        if (user == null) {
            regularAuditService.audit(new RegularAuditModel("Request to order cart items",  email, "No user found", false));
        }
        CartModel cart = user.getCartModel();
        List<CartTempModel> cartItems = cart.getItems();
        OrderModel tempModel = null;
        List<OrderModel> ordersList = new ArrayList<>();
        for (int i = 0; i < cartItems.size(); ++i) {
            CartTempModel cartItem = cartItems.get(i);
            ProductModel productModel = productRepository.findByProductId(cartItem.getProductId());
            if (Integer.parseInt(productModel.getQuantity()) < Integer.parseInt(cartItem.getQuantity())) continue;
            Float totalPrice = Integer.parseInt(cartItem.getQuantity()) * Float.parseFloat(cartItem.getPrice());
            productModel.setQuantity(String.valueOf(Integer.parseInt(productModel.getQuantity()) - Integer.parseInt(cartItem.getQuantity())));
            productRepository.save(productModel);
            tempModel = new OrderModel(user.getUserId(), cartItem.getProductName(), cartItem.getQuantity(), String.valueOf(totalPrice), "Ordered", cartItem.getPrice());
            orderRepository.save(tempModel);
            user.addItems(tempModel);
            ordersList.add(tempModel);
        }
        cart.setPrice("0.0");
        cart.setProductName("User cart");
        cart.setQuantity("0");
        cart.resetItems();
        userRepository.save(user);
        regularAuditService.audit(new RegularAuditModel("Request to order cart items",  email, "Added cart items to cart", true));
        return ordersList;
    }

    public List<OrderModel> getAllOrders() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        regularAuditService.audit(new RegularAuditModel("Request to get all orders",  email, "Fetched all orders", true));
        return orderRepository.findAll();
    }

    public ResponseEntity<?> placeOrder(ProductTempModel productTempModel) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel user = userRepository.findByEmail(email);
        ProductModel productModel = productRepository.findByProductId(productTempModel.getProductId());
        Float totalPrice = Integer.parseInt(productModel.getQuantity()) * Float.parseFloat(productModel.getPrice());
        regularAuditService.audit(new RegularAuditModel("Request to place order",  email, "", true));
        OrderModel tempModel = new OrderModel(user.getUserId(), productModel.getProductName(), productModel.getQuantity(), String.valueOf(totalPrice), "Ordered", productModel.getPrice());
        orderRepository.save(tempModel);
        user.addItems(tempModel);
        userRepository.save(user);
        regularAuditService.audit(new RegularAuditModel("Request to place order",  email, "Order was placed", false));
        return ResponseEntity.ok().body(tempModel);
    }
}
