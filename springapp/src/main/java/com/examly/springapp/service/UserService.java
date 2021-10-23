package com.examly.springapp.service;

import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;

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

	public ResponseEntity<? extends Object> findUserDetails(String id) {
		List<String> errors = new ArrayList<>();
		String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserModel userModel = userRepository.findByUserId(id);
		if(email.equals(userModel.getEmail())) {
			UserTempModel userTempModel = new UserTempModel(userModel.getUsername(), userModel.getMobileNumber(), userModel.isActive(), userModel.getEmail());
			return ResponseEntity.ok().body(userTempModel);
		}
		else{
			errors.add("Invalid request");
			return ResponseEntity.ok().body(new ApiResponse(false, "Your request cannot be processed.", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
		}
	}

	class UserTempModel{
		private String username;
		private String mobileNumber;
		private boolean active;
		private String email;
		public UserTempModel() {

		}

		public UserTempModel(String username, String mobileNumber, boolean active, String email) {
			this.username = username;
			this.mobileNumber = mobileNumber;
			this.active = active;
			this.email = email;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public String getMobileNumber() {
			return mobileNumber;
		}

		public void setMobileNumber(String mobileNumber) {
			this.mobileNumber = mobileNumber;
		}

		public boolean isActive() {
			return active;
		}

		public void setActive(boolean active) {
			this.active = active;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}
	}
}
