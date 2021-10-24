package com.examly.springapp.exceptioncontroller;

import com.examly.springapp.exception.IdInvalidException;
import com.examly.springapp.exception.PriceInvalidException;
import com.examly.springapp.exception.QuantityInvalidException;
import com.examly.springapp.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@ControllerAdvice
public class CartExceptionController {

    @ExceptionHandler(QuantityInvalidException.class)

    public ResponseEntity<?> exception(QuantityInvalidException e) {
        List<String> errors = new ArrayList<>();
        errors.add("Invalid quantity");
        return ResponseEntity.ok().body(new ApiResponse(false, "Quantity should be an integer", UNPROCESSABLE_ENTITY.value(), UNPROCESSABLE_ENTITY, errors));
    }

    @ExceptionHandler(IdInvalidException.class)

    public ResponseEntity<?> exception(IdInvalidException e) {
        List<String> errors = new ArrayList<>();
        errors.add("Invalid id");
        return ResponseEntity.ok().body(new ApiResponse(false, "Id should be an integer", UNPROCESSABLE_ENTITY.value(), UNPROCESSABLE_ENTITY, errors));
    }

    @ExceptionHandler(PriceInvalidException.class)

    public ResponseEntity<?> exception(PriceInvalidException e) {
        List<String> errors = new ArrayList<>();
        errors.add("Invalid price");
        return ResponseEntity.ok().body(new ApiResponse(false, "Price should be float", UNPROCESSABLE_ENTITY.value(), UNPROCESSABLE_ENTITY, errors));
    }
}
