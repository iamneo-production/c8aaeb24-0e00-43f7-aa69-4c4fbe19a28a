package com.examly.springapp.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.examly.springapp.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import static java.util.Arrays.stream;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

public class CustomAuthorizationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        List<String> errors = new ArrayList<>();
        if(request.getServletPath().equals("/login") || request.getServletPath().equals("/signup") || request.getServletPath().startsWith("/verify") || request.getServletPath().startsWith("/forgot") || request.getServletPath().startsWith("/verifyCode") || request.getServletPath().startsWith("/savePassword") || request.getServletPath().startsWith("/swagger-ui.html") || request.getServletPath().startsWith("/swagger-ui") || request.getServletPath().startsWith("/api")) {
            filterChain.doFilter(request, response);
        }
        else {
            String authorizationToken = request.getHeader(AUTHORIZATION);
            System.out.println("Here" + authorizationToken);
            if(authorizationToken != null && authorizationToken.startsWith("Bearer ")) {
                try {
                    String token = authorizationToken.substring("Bearer ".length());
                    Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
                    JWTVerifier verifier = JWT.require(algorithm).build();
                    DecodedJWT decodedJWT = verifier.verify(token);
                    String username = decodedJWT.getSubject();
                    String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
                    Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    stream(roles).forEach(role -> {
                        authorities.add(new SimpleGrantedAuthority(role));
                    });
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    filterChain.doFilter(request, response);
                }
                catch (Exception e) {
                    errors.add(e.getMessage());
                    response.setContentType(APPLICATION_JSON_VALUE);
                    response.setStatus(HttpStatus.OK.value());
                    new ObjectMapper().writeValue(response.getOutputStream(), new ApiResponse(false, "Your request cannot be processed.", OK.value(), OK, errors));
                }
            }
            else {
                filterChain.doFilter(request, response);
            }
        }
    }
}
