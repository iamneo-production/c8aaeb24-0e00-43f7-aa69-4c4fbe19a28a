package com.examly.springapp.service;

import com.examly.springapp.mfa.TotpManager;
import com.examly.springapp.model.CartModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.springframework.http.HttpStatus.*;

@Service
public class SignupService {
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TotpManager totpManager;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public ResponseEntity<?> saveUser(@Valid UserModel userModel) {
		boolean emailExists = userExistsWithEmail(userModel.getEmail());
		boolean userNameExists = userExistsWithUserName(userModel.getUsername());
		ArrayList<String> errors = new ArrayList<>();
		if(!emailExists || !userNameExists) {
			try {
				ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
				Set<ConstraintViolation<UserModel>> violations = factory.getValidator().validate(userModel);
				for (ConstraintViolation<UserModel> violation: violations) {
					errors.add(violation.getMessage());
				}
				if(errors.size() > 0)
//					return new ResponseEntity<Object>(new ApiResponse("Validation failed", "406", errors), HttpStatus.OK);
					return new ResponseEntity<Object>(new ApiResponse(false,"Validation of bean failed", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
			catch (Exception e) {
				//return new ResponseEntity<Object>(new ApiError(e.getMessage(), HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK);
				//return true;
//				return new ResponseEntity<Object>(new ApiResponse(e.getMessage(), "406", new ArrayList<>()), HttpStatus.OK);
				errors.add(e.getLocalizedMessage());
				return new ResponseEntity<Object>(new ApiResponse(false,"There was an error", FORBIDDEN.value(), FORBIDDEN, errors), OK);
			}
		}
		try {
			if(emailExists && userNameExists) {
				//return new ResponseEntity<Object>(new ApiError("User already exists", HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK);
				//return false;
//				return new ResponseEntity<Object>(new ApiResponse("User already exists", "406", new ArrayList<>()), HttpStatus.OK);
				errors.add("User already exists");
				errors.add("Signup unsuccessful");
				return new ResponseEntity<Object>(new ApiResponse(false,"A user with this email and username already exists", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), OK);
			}
			else if(userExistsWithEmail(userModel.getEmail())) {
				//return new ResponseEntity<Object>(new ApiError("Email already exists", HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK); 
				//return true;
//				return new ResponseEntity<Object>(new ApiResponse("Email already exists", "406", new ArrayList<>()), HttpStatus.OK);
				errors.add("User already exists");
				errors.add("Signup unsuccessful");
				return new ResponseEntity<Object>(new ApiResponse(false,"A user with this email already exists", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), OK);
			}
			else if(userExistsWithUserName(userModel.getUsername())) {
				//return new ResponseEntity<Object>(new ApiError("Username already exists", HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK); 
				//return false;
//				return new ResponseEntity<Object>(new ApiResponse("Username already exists", "406", new ArrayList<>()), HttpStatus.OK);
				errors.add("User already exists");
				errors.add("Signup unsuccessful");
				return new ResponseEntity<Object>(new ApiResponse(false,"A user with this username already exists", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), OK);
			}
			else {
				//System.out.println("Cart Id: " + cart.getId());
				//List<UserModel> usersList = userRepository.findAll();
				//System.out.println("Rows in users table: " + usersList.size());
				CartModel cart = new CartModel(null, "User Cart", "0", "0.0");
				//cartRepository.save(cart);
				String role = userModel.getUsername().equals("admin") ? "admin" : "user";
				userModel.setPassword(passwordEncoder.encode(userModel.getPassword()));
				String secret = UUID.randomUUID().toString();
				UserModel temp = new UserModel(null, userModel.getEmail(), userModel.getPassword(), userModel.getUsername(), userModel.getMobileNumber(), true, role , cart, null , userModel.isMfa(), secret);
				//cart.setUserModel(temp);
				userRepository.save(temp);
				if(temp.isMfa()) {
					HttpHeaders httpHeaders = new HttpHeaders();
					httpHeaders.add("mfa", "true");
					return ResponseEntity.ok().headers(httpHeaders).body(new ApiResponse(true, totpManager.getUriForImage(secret), OK.value(), OK, errors));
				}
			}
		}
		catch(DataIntegrityViolationException e) {
			if(e.getMessage().contains("constraint")) {
				//return new ResponseEntity<Object>(new ApiError("Constraint Error", HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK);
				//return false;
//				return new ResponseEntity<Object>(new ApiResponse("Constraint Error", "406", new ArrayList<>()), HttpStatus.OK);
				errors.add(e.getLocalizedMessage());
				errors.add("Signup unsuccessful");
				return new ResponseEntity<Object>(new ApiResponse(false,"There was a constraint error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), OK);
			}
		}
		//return new ResponseEntity<Object>(new ApiSuccess("User created", HttpStatus.OK, 200, true), HttpStatus.OK); 
		//return true;
//		return new ResponseEntity<Object>(new ApiResponse("User created", "200", new ArrayList<>()), HttpStatus.OK);
		return new ResponseEntity<Object>(new ApiResponse(true,"User creation was successful", OK.value(), OK, errors), OK);
	}
	
	public boolean userExistsWithEmail(String email){
		UserModel user = userRepository.findByEmail(email);
		//System.out.println(users.size());
		if(user == null) {
			return false;
		}
		return true;
	}
	
	public boolean userExistsWithUserName(String username) {
		UserModel user = userRepository.findByUsername(username);
		if(user == null) {
			return false;
		}
		return true;
	}
}
