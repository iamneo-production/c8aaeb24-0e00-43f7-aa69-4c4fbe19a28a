package com.examly.springapp.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class ExceptionResponse {
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
	
	private String message;
	private String debugMessage;
	private LocalDateTime timestamp;
	private HttpStatus status;
	private int internalErrorCode;
	
	public ExceptionResponse() {
		setTimestamp(LocalDateTime.now());
	}
	
	public ExceptionResponse(HttpStatus status) {
		this();
	}
	
	public ExceptionResponse(HttpStatus status, Throwable e) {
		this();
		this.message = "Unexpected error";
		this.setDebugMessage(e.getLocalizedMessage());
	}
	
	public ExceptionResponse(HttpStatus status, String message, Throwable e) {
		this();
		this.setStatus(status);
		this.message = message;
		this.setDebugMessage(e.getLocalizedMessage());
	}

	public ExceptionResponse(HttpStatus status, String message, int internalErrorCode, Throwable e) {
		this();
		this.setStatus(status);
		this.message = message;
		this.internalErrorCode = internalErrorCode;
		this.setDebugMessage(e.getLocalizedMessage());
	}
	
	public HttpStatus getStatus() {
		return status;
	}

	public void setStatus(HttpStatus status) {
		this.status = status;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

	public String getDebugMessage() {
		return debugMessage;
	}

	public void setDebugMessage(String debugMessage) {
		this.debugMessage = debugMessage;
	}

	public int getInternalErrorCode() {
		return internalErrorCode;
	}

	public void setInternalErrorCode(int internalErrorCode) {
		this.internalErrorCode = internalErrorCode;
	}
}
