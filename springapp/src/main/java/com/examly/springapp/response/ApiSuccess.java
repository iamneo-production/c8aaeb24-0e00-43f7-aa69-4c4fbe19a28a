package com.examly.springapp.response;

import org.springframework.http.HttpStatus;

public class ApiSuccess {
	private String message;
	private HttpStatus httpStatus;
	private int successCode;
	private boolean requestProccessed;
	
	public ApiSuccess() {
		
	}

	public ApiSuccess(String message, HttpStatus httpStatus, int successCode, boolean requestProccessed) {
		super();
		this.message = message;
		this.httpStatus = httpStatus;
		this.successCode = successCode;
		this.requestProccessed = requestProccessed;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public HttpStatus getHttpStatus() {
		return httpStatus;
	}

	public void setHttpStatus(HttpStatus httpStatus) {
		this.httpStatus = httpStatus;
	}

	public int getSuccessCode() {
		return successCode;
	}

	public void setSuccessCode(int successCode) {
		this.successCode = successCode;
	}

	public boolean isRequestProccessed() {
		return requestProccessed;
	}

	public void setRequestProccessed(boolean requestProccessed) {
		this.requestProccessed = requestProccessed;
	}
	
}
