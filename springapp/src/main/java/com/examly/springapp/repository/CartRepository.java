package com.examly.springapp.repository;

import com.examly.springapp.model.CartModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartModel, String> {
    CartModel findByCartItemId(String cartItemId);
}