package com.examly.springapp.controller;

import com.examly.springapp.model.UserModel;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/users")
	public List<UserModel> getAll() {
		return userService.getAllUsers();
	}

	@GetMapping("/user/info/{id}")
	public ResponseEntity<?> getInfo(@PathVariable String id) {
		return userService.findUserDetails(id);
	}
}
