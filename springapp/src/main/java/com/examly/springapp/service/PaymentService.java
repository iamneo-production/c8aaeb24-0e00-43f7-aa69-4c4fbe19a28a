package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.model.PaymentModel;
import com.examly.springapp.repository.PaymentRepository;
import com.examly.springapp.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.validation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.OK;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RegularAuditService regularAuditService;

    public ResponseEntity<?> savePayment(@Valid PaymentModel paymentModel) {
        List<String> errors = new ArrayList<>();
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<PaymentModel>> violations = validator.validate(paymentModel);
            for (ConstraintViolation<PaymentModel> violation : violations) {

                errors.add(violation.getMessage());
            }
            if (errors.size() > 0)
            {
                regularAuditService.audit(new RegularAuditModel("Request to add payment order",  email, "Validation failed", false));
                return ResponseEntity.ok().body(new ApiResponse(false, "Invalid data entered", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
            }
        } catch (ConstraintViolationException e) {
            regularAuditService.audit(new RegularAuditModel("Request to add payment order",  email, "Constraint error was caused", false));
            errors.add(e.getMessage());
            return ResponseEntity.ok().body(new ApiResponse(false, "Constraint Error", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, errors));
        }
        paymentRepository.save(paymentModel);
        return ResponseEntity.ok().body(new ApiResponse(true, "The payment is saved", OK.value(), OK, new ArrayList<>()));
    }
}
