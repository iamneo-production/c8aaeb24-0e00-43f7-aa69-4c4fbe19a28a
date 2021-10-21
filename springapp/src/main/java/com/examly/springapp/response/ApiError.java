package com.examly.springapp.response;

import org.springframework.http.HttpStatus;

public class ApiError {
	
	private String message;
	private HttpStatus httpStatus;
	private String debugString;
	private int internalCode;
	private int errorCode;
	
	public ApiError() {
		
	}

	public ApiError(String message, HttpStatus httpStatus, String debugString, int internalCode, int errorCode) {
		super();
		this.message = message;
		this.httpStatus = httpStatus;
		this.debugString = debugString;
		this.internalCode = internalCode;
		this.errorCode = errorCode;
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

	public String getDebugString() {
		return debugString;
	}

	public void setDebugString(String debugString) {
		this.debugString = debugString;
	}

	public int getInternalCode() {
		return internalCode;
	}

	public void setInternalCode(int internalCode) {
		this.internalCode = internalCode;
	}

	public int getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}
	
	
}
