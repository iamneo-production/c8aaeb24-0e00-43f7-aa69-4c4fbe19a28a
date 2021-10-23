package com.examly.springapp.service;

import com.examly.springapp.email.EmailSenderService;
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

import javax.mail.MessagingException;
import javax.validation.*;
import java.io.UnsupportedEncodingException;
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

	@Autowired
	private EmailSenderService emailSenderService;
	
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
			else if(emailExists) {
				//return new ResponseEntity<Object>(new ApiError("Email already exists", HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK); 
				//return true;
//				return new ResponseEntity<Object>(new ApiResponse("Email already exists", "406", new ArrayList<>()), HttpStatus.OK);
				errors.add("User already exists");
				errors.add("Signup unsuccessful");
				return new ResponseEntity<Object>(new ApiResponse(false,"A user with this email already exists", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors), OK);
			}
			else if(userNameExists) {
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
				String body = "    <h3>Dear " + userModel.getUsername() + ",</h3>\n" +
						"    <p>This email is a response to let you know that your account has been created.</p>\n"  +
						"    <p>We are excited to have you, and you may receive and be notified about offers via mail.</p>\n" +
						"    <p>For any other queries, you may write a mail to team2.ebookstore@gmail.com.\n" +
						"    </p>\n" +
						"    <br>\n" +
						"    <p>Thanks for using our services, Ebook Store (Team 2)</p><hr style=\"border: 0;height: 1px;background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));\"></hr><a href=\"http://localhost:4200\"><img src=\"https://rukminim1.flixcart.com/flap/500/500/image/b3fe381767050079.jpg?q=100\"></img></a>";
				emailSenderService.sendMail(userModel.getEmail(), "Welcome to Ebook store!", body);
				userRepository.save(temp);
				if(temp.isMfa()) {
					HttpHeaders httpHeaders = new HttpHeaders();
					httpHeaders.add("mfa", "true");
					return ResponseEntity.ok().headers(httpHeaders).body(new ApiResponse(true, totpManager.getUriForImage(secret, temp.getEmail(), "EBook Store - Team 2"), OK.value(), OK, errors));
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
		} catch (MessagingException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
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
