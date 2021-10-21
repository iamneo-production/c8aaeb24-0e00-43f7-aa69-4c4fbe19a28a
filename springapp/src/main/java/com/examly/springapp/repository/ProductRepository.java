package com.examly.springapp.repository;

import com.examly.springapp.model.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<ProductModel, String>{
	ProductModel findByProductId(String productId);
	
	@Query("SELECT COUNT(productName) from ProductModel p")
	public int getNumberOfProducts();

	@Override
	boolean existsById(String productId);
}
