package com.examly.springapp.response;

import org.springframework.http.HttpStatus;

import java.util.List;

public class ApiResponse {
    private boolean result;
    private String message;
    private int status;
    private HttpStatus httpStatus;
    private List<String> errors;

    public ApiResponse() {

    }

    public ApiResponse(boolean result, String message, int status, HttpStatus httpStatus, List<String> errors) {
        this.result = result;
        this.message = message;
        this.status = status;
        this.httpStatus = httpStatus;
        this.errors = errors;
    }

    public boolean isResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
