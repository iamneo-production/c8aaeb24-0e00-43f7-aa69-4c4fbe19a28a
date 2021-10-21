package com.examly.springapp.repository;

import com.examly.springapp.model.OrderModel;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderModel, String>{
	
	public List<OrderModel> findByUserId(String id);

	List<OrderModel> findByUserIdEquals(@NonNull String userId);
}
