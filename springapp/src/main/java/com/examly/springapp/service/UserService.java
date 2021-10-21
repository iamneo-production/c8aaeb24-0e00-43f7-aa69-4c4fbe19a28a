package com.examly.springapp.service;

import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	public List<UserModel> getAllUsers() {
		return userRepository.findAll();
	}
	
	public UserModel findUserModel (String id) {
		return userRepository.findByUserId(id);
	}
}
