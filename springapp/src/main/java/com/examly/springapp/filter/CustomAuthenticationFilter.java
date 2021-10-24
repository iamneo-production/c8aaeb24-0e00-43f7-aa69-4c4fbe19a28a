package com.examly.springapp.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
import com.examly.springapp.mfa.TotpManager;
import com.examly.springapp.model.LoginModel;
import com.examly.springapp.response.ApiResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    @Autowired
    private final AuthenticationManager authenticationManager;

    @Autowired
    private TotpManager totpManager;

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        LoginModel loginModel = null;
        String email = "";
        String password = "";
        try {
            String test = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            if (test == null) {
                throw new UsernameNotFoundException("User not found");
            }
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(test);
            email = jsonNode.get("email").asText();
            password = jsonNode.get("password").asText();
            if (email == null || email == "" || password == null || password == "") {
                throw new UsernameNotFoundException("User not found");
            }
            loginModel = new LoginModel(email, password);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (loginModel == null) {
            throw new UsernameNotFoundException("User not found");
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginModel.getEmail(), loginModel.getPassword());;
        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {

        String mfa = request.getHeader("mfa");
        User user = (User) authentication.getPrincipal();
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        List<String> data = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        String isActive = getValue(data.get(0));
        data.remove(0);
        String isMfa = getValue(data.get(0));
        data.remove(0);
        String role = getValue(data.get(0));
        data.remove(0);
        String isVerifiedForTOTP = getValue(data.get(0));
        data.remove(0);
        String userId = getValue(data.get(0));
        data.remove(0);
        data.add(role);
        System.out.println(data);
        if (isActive.equals("false")) {
            List<String> errors = new ArrayList<>();
            response.setStatus(OK.value());
            response.setContentType(APPLICATION_JSON_VALUE);
            errors.add("User blocked");
            new ObjectMapper().writeValue(response.getOutputStream(), new ApiResponse(false, "The user is disabled. Contact Administrator.", NOT_ACCEPTABLE.value(), NOT_ACCEPTABLE, new ArrayList<>()));
        }
        if (isMfa.equals("true") && isVerifiedForTOTP.equals("true")) {
            response.setHeader("mfa", "true");
            response.setStatus(OK.value());
            response.setContentType(APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getOutputStream(), new ApiResponse(true, "Needed two step verification", OK.value(), OK, new ArrayList<>()));
        } else {
            Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
            String access_token = JWT.create()
                    .withSubject(user.getUsername())
                    .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 1000))
                    .withIssuer(request.getRequestURL().toString())
                    .withClaim("user_id", userId)
                    .withClaim("roles", data)
                    .sign(algorithm);
            response.setHeader("Authorization", access_token);
            response.setHeader("mfa", "false");
            response.setStatus(OK.value());
            response.setContentType(APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getOutputStream(), new ApiResponse(true, access_token, OK.value(), OK, new ArrayList<>()));
        }
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(OK.value());
        response.setContentType(APPLICATION_JSON_VALUE);
        List<String> errors = new ArrayList<>();
        errors.add("Unsuccessful authentication");
        new ObjectMapper().writeValue(response.getOutputStream(), new ApiResponse(false, "No user was found for the above credentials", FORBIDDEN.value(), FORBIDDEN, errors));

    }

    public String getValue(String s) {
        String[] array = s.split("=");
        return array[1];
    }
}
