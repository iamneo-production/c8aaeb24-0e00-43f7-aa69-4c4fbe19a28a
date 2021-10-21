package com.examly.springapp.service;

import com.examly.springapp.exception.PriceInvalidException;
import com.examly.springapp.exception.QuantityInvalidException;
import com.examly.springapp.model.ProductModel;
import com.examly.springapp.repository.ProductRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.examly.springapp.service.CartService.checkNumber;
import static com.examly.springapp.service.CartService.checkNumberFloat;
import static org.springframework.http.HttpStatus.*;

@Service
public class ProductService {
	
	@Autowired
	private ProductRepository productRespository;
	
	public List<ProductModel> getProduct() {
		return productRespository.findAll();
	}
	
	// Verified
	public List<ProductModel> getHomeProduct() {
		return productRespository.findAll();
	}
	
	public ResponseEntity<?> productEditData(String id) {
		List<String> errors = new ArrayList<>();
		ProductModel product = productRespository.findByProductId(id);
		if(product == null) {
			errors.add("Invalid id");
			return ResponseEntity.ok().body(new ApiResponse(false, "There is no product for the given id", FORBIDDEN.value(), FORBIDDEN, errors));
		}
		return ResponseEntity.ok().body(product);
	}
	
	public ResponseEntity<?> productEditSave(String id,  ProductModel productModel) {
		String quantity = productModel.getQuantity();
		if( !checkNumber(quantity) || quantity==null || quantity=="") throw new QuantityInvalidException();
		String price = productModel.getPrice();
		if( !checkNumberFloat(price) || price==null || price=="") throw new PriceInvalidException();
		List<String> errors = new ArrayList<>();
		ProductModel product = productRespository.findByProductId(id);
		if(product == null) {
			errors.add("Invalid product id");
			return ResponseEntity.ok().body(new ApiResponse(false, "There is no product for the given id", FORBIDDEN.value(), FORBIDDEN, errors));
		}
		product.setProductName(productModel.getProductName());
		product.setDescription(productModel.getDescription());
		product.setImageUrl(productModel.getImageUrl());
		product.setPrice(productModel.getPrice());
		product.setQuantity(productModel.getQuantity());
		productRespository.save(product);
		return ResponseEntity.ok().body(new ApiResponse(true, "The product has been edited", OK.value(), OK, errors));
	}
	
	public ResponseEntity<?> productSave(ProductModel data) {
		List<String> errors = new ArrayList<>();
		System.out.println(data.getImageUrl());
		ProductModel productModel = productRespository.save(data);
		if(productModel == null) {
			errors.add("Saving product unsuccessful");
			return new ResponseEntity<Object>(new ApiResponse(false, "There was an unknown error during saving the product", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), HttpStatus.OK);
		}
		return new ResponseEntity<Object>(new ApiResponse(true, "Product has been added to the database", OK.value(), OK, errors), HttpStatus.OK);
	}
	
	public ResponseEntity<?> productDelete(String id) {
		List<String> errors = new ArrayList<>();
 		ProductModel product = productRespository.findByProductId(id);
		if(product == null) {
			errors.add("Invalid product id");
			return ResponseEntity.ok().body(new ApiResponse(false, "There is no product for the given id", FORBIDDEN.value(), FORBIDDEN, errors));
		}
		productRespository.delete(product);
		//productRespository.deleteByProductId(id);
		return ResponseEntity.ok().body(new ApiResponse(true, "The product has been deleted.", OK.value(), OK, errors));
	}

}
