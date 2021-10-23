package com.examly.springapp.service;

import com.examly.springapp.email.EmailSenderService;
import com.examly.springapp.mfa.TotpManager;
import com.examly.springapp.model.LoginModel;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.response.ApiResponse;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;

@Service
public class LoginService {
	
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EmailSenderService emailSenderService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public boolean checkUser(LoginModel loginModel) {
		UserModel user = userRepository.findByEmail(loginModel.getEmail());
		if (user==null) {
			return false;
		}
		return true;
	}

	public ResponseEntity<?> forgot(String email) {
		List<String> errors = new ArrayList<>();
		UserModel userModel = userRepository.findByEmail(email);
		if(userModel==null) {
			errors.add("User not found");
			return ResponseEntity.ok().body(new ApiResponse(false, "No user found for given email", FORBIDDEN.value(), FORBIDDEN, errors));
		}
		else {
			String code = String.valueOf(UUID.randomUUID()) + String.valueOf(UUID.randomUUID());
			code = code.replaceAll("-", "");
			userModel.setForgotCode(code);
			String body = "    <h3>Dear " + userModel.getUsername() + ",</h3>\n" +
					"    <p>This email is in response to a request to reset your Ebook store password.</p>\n" +
					"    <p>Code: " + code + "</p>\n" +
					"    <p>Enter this code in the field provided to reset your password.</p>\n" +
					"    <p>If you did not make this request, you can ignore this email and your password won't be changed.\n" +
					"    </p>\n" +
					"    <br>\n" +
					"    <p>Thanks for using our services, Ebook Store (Team 2)</p><hr style=\"border: 0;height: 1px;background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));\"></hr><a href=\"http://localhost:4200\"><img src=\"https://rukminim1.flixcart.com/flap/500/500/image/b3fe381767050079.jpg?q=100\"></img></a>";
			try {
				emailSenderService.sendMail(userModel.getEmail(), "Ebook Store - Reset your password", body);
			} catch (MessagingException e) {
				e.printStackTrace();
				errors.add(e.getLocalizedMessage());
				return ResponseEntity.ok().body(new ApiResponse(false, "There was an issue in sending mail", FORBIDDEN.value(), FORBIDDEN, errors));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
				errors.add("The encoding of mail is not supported");
				return ResponseEntity.ok().body(new ApiResponse(false, "There was an issue in sending mail", FORBIDDEN.value(), FORBIDDEN, errors));
			}
			userRepository.save(userModel);
			return ResponseEntity.ok().body(new ApiResponse(true, "The mail with code has been sent, please check your inbox", OK.value(), OK, errors));
		}
	}

	public ResponseEntity<?> verifyCode(String email, String code) {
		List<String> errors = new ArrayList<>();
		UserModel userModel = userRepository.findByEmail(email);
		System.out.println(code);
		if(userModel==null) {
			errors.add("User not found");
			return ResponseEntity.ok().body(new ApiResponse(false, "No user found for given email", FORBIDDEN.value(), FORBIDDEN, errors));
		}
		else {
//			System.out.println(userModel.getForgotCode());
			if(userModel.getForgotCode().equals(code)) {
				return ResponseEntity.ok().body(new ApiResponse(true, "The given code was validated, please enter your new password", OK.value(), OK, errors));
			}
			else {
				errors.add("Invalid code");
				return ResponseEntity.ok().body(new ApiResponse(false, "Invalid code provided for this user", FORBIDDEN.value(), FORBIDDEN, errors));
			}
		}
	}

	public ResponseEntity<?> savePassword(String email, String password, String conformPassword, String code) throws MessagingException, UnsupportedEncodingException {
		List<String> errors = new ArrayList<>();
//		System.out.println(password + " " + conformPassword);
//		System.out.println(password.equals(conformPassword));
		if( !password.equals(conformPassword) ) {
			errors.add("Invalid passwords");
			return ResponseEntity.ok().body(new ApiResponse(false, "Both passwords doesn't match", FORBIDDEN.value(), FORBIDDEN, errors));
		}
		else {
			UserModel userModel = userRepository.findByEmail(email);
			if(userModel == null) {
				errors.add("User not found");
				return ResponseEntity.ok().body(new ApiResponse(false, "No user found for given email", FORBIDDEN.value(), FORBIDDEN, errors));
			}
			else {
				if( !code.equals(userModel.getForgotCode())) {
					errors.add("Wrong code");
					return ResponseEntity.ok().body(new ApiResponse(false, "Invalid code provided for this user", FORBIDDEN.value(), FORBIDDEN, errors));
				}
				else {
					userModel.setPassword(passwordEncoder.encode(password));
					userModel.setForgotCode("");
					String body = "    <h3>Dear " + userModel.getUsername() + ",</h3>\n" +
							"    <p>This email is a response to let you know that your password has been changed.</p>\n"  +
							"    <p>If you are not the one that did this action, please contact Administrator to disable your account.</p>\n" +
							"    <p>After subsequent discussions and verifications, your account can be activated again.\n" +
							"    </p>\n" +
							"    <br>\n" +
							"    <p>Thanks for using our services, Ebook Store (Team 2)</p><hr style=\"border: 0;height: 1px;background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));\"></hr><a href=\"http://localhost:4200\"><img src=\"https://rukminim1.flixcart.com/flap/500/500/image/b3fe381767050079.jpg?q=100\"></img></a>";
					emailSenderService.sendMail(userModel.getEmail(), "Password for your Ebook store is changed", body);
					userRepository.save(userModel);
					return ResponseEntity.ok().body(new ApiResponse(true, "Password changed successfully", OK.value(), OK, errors));
				}
			}
		}
	}

	public boolean checkActive(String email) {
		UserModel userModel = userRepository.findByEmail(email);
		return userModel.isActive();
	}

//	public ResponseEntity<Object> checkUser1(@Valid LoginModel loginModel) {
//		try {
//			ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
//			Validator validator = factory.getValidator();
//			Set<ConstraintViolation<LoginModel>> violations = validator.validate(loginModel);
//			List<String> errors = new ArrayList<>();
//			for (ConstraintViolation<LoginModel> violation: violations) {
//				//System.out.print(violation.getMessage());
//				//return new ResponseEntity<Object>(new ApiError(violation.getMessage(), HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK);
//				//return false;
//				errors.add(violation.getMessage());
//			}
//			if(errors.size() > 0)
////				return new ResponseEntity<Object>(new ApiResponse("Validation failed", "406", errors), HttpStatus.OK);
//				return ResponseEntity.ok().body(false);
//		}
//		catch(ConstraintViolationException e) {
//			//return new ResponseEntity<Object>(new ApiError(e.getMessage(), HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK);
//			//return false;
////			return new ResponseEntity<Object>(new ApiResponse(e.getMessage(), "406", new ArrayList<>()), HttpStatus.OK);
//			return ResponseEntity.ok().body(false);
//		}
//		try {
//			UserModel user = userRepository.findByEmail(loginModel.getEmail());
//			if(user == null) {
//				//return new ResponseEntity<Object>(new ApiError("User not found", HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK);
////				return new ResponseEntity<Object>(new ApiResponse("User not found", "406", new ArrayList<>()), HttpStatus.OK);
//				return ResponseEntity.ok().body(false);
//			}
//			else if(user.getPassword().equals(loginModel.getPassword())) {
//				//return new ResponseEntity<Object>(new ApiSuccess("Login Success", HttpStatus.OK, 200, true), HttpStatus.OK);
////				return new ResponseEntity<Object>(new ApiResponse("Login Success", "200", new ArrayList<>()), HttpStatus.OK);
//				return ResponseEntity.ok().body(true);
//			}
//			//return new ResponseEntity<Object>(new ApiError("User credentials doesn't match", HttpStatus.UNAUTHORIZED, "Error", 101, 401), HttpStatus.OK);
////			return new ResponseEntity<Object>(new ApiResponse("User credentials doesn't match", "406", new ArrayList<>()), HttpStatus.OK);
//			return ResponseEntity.ok().body(false);
//		}
//		catch(DataIntegrityViolationException e) {
//			if(e.getMessage().contains("constraint")) {
//				//return new ResponseEntity<Object>(new ApiError("Constraint Error", HttpStatus.NOT_ACCEPTABLE, "Error", 101, 406), HttpStatus.OK);
//				//return false;
////				return new ResponseEntity<Object>(new ApiResponse("Constraint Error", "406", new ArrayList<>()), HttpStatus.OK);
//				return ResponseEntity.ok().body(false);
//			}
//		}
//		//return new ResponseEntity<Object>(new ApiSuccess("Login Success", HttpStatus.OK, 200, true), HttpStatus.OK);
//		//return false;
////		return new ResponseEntity<Object>(new ApiResponse("Login success", "200", new ArrayList<>()), HttpStatus.OK);
//		return ResponseEntity.ok().body(true);
//	}
}
