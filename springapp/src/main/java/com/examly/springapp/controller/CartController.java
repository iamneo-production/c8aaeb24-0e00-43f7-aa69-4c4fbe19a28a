package com.examly.springapp.controller;

import com.examly.springapp.dao.ProductTempModel;
import com.examly.springapp.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

@Transactional
@RestController
public class CartController {

    @Autowired
    public CartService cartService;

    public static boolean checkNumber(String number) {
        return number.chars().allMatch(Character::isDigit);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/home/{id}")
    public ResponseEntity<?> addToCart(String quantity, @PathVariable String id, @RequestBody ProductTempModel productTempModel) {

        return cartService.addProduct(id, productTempModel);


    }

    @RequestMapping(method = RequestMethod.GET, value = "/cart/{id}")
    public ResponseEntity<?> showCart(@PathVariable String id) {
        return cartService.findCart(id);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/cart/delete")
    public ResponseEntity<?> deleteCartItem(@RequestBody ProductTempModel productTempModel) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return cartService.deleteCartItem(username, productTempModel);


    }


}