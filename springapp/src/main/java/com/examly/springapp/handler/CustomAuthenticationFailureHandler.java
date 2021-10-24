package com.examly.springapp.handler;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.response.ApiResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Autowired
    private RegularAuditService regularAuditService;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        String email = "", password = "";
        try {
            String test = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            if (test == null) {
                regularAuditService.audit(new RegularAuditModel("Request for login with wrong format", "", "", false));
                throw new UsernameNotFoundException("User not found");
            }
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(test);
            email = jsonNode.get("email").asText();
            password = jsonNode.get("password").asText();
        }
        catch (Exception e) {
            regularAuditService.audit(new RegularAuditModel("Authetication failed", "", "Exception caused", false));
        }

        regularAuditService.audit(new RegularAuditModel("Authentication failed for user", email, "", false));
        List<String> errors = new ArrayList<>();
        response.setStatus(OK.value());
        response.setContentType(APPLICATION_JSON_VALUE);
        OutputStream outputStream = response.getOutputStream();
        ObjectMapper objectMapper = new ObjectMapper();
        errors.add("Authentication failed");
        objectMapper.writeValue(outputStream, new ApiResponse(false, "You are not authenticated", FORBIDDEN.value(), FORBIDDEN, errors));
        outputStream.flush();
    }
}
