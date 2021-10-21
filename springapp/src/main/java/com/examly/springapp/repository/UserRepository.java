package com.examly.springapp.repository;

import com.examly.springapp.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<UserModel, String>{
	public UserModel findByEmail(String email);
	public UserModel findByUsername(String username);
	public UserModel findByUserId(String id);
	
	@Query("SELECT COUNT(email) from UserModel u")
	public int getNumberOfUsers();
}
