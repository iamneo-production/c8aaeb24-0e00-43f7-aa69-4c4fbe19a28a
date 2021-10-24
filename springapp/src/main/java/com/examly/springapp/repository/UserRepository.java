package com.examly.springapp.repository;

import com.examly.springapp.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<UserModel, String> {
    UserModel findByEmail(String email);

    UserModel findByUsername(String username);

    UserModel findByUserId(String id);

    @Query("SELECT COUNT(email) from UserModel u")
	int getNumberOfUsers();
}
