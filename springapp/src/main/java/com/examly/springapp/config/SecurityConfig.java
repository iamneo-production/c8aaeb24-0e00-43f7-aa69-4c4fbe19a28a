package com.examly.springapp.config;

import com.examly.springapp.filter.CustomAccessDeniedHandler;
import com.examly.springapp.filter.CustomAuthenticationEntryPoint;
import com.examly.springapp.config.SimpleCORSFilter;
import com.examly.springapp.filter.CustomAuthenticationFilter;
import com.examly.springapp.filter.CustomAuthorizationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Autowired
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(authenticationManagerBean());
        customAuthenticationFilter.setFilterProcessesUrl("/login");
//        http
//                .csrf()
//                .disable()
//                .cors()
//                .disable()
//                .sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and()
//                .authorizeRequests().antMatchers("/login", "/signup").permitAll()
//                .and()
//                .authorizeRequests().antMatchers("/home/**", "/cart/**", "/saveOrder/**", "/orders/**", "/placeOrder/**").hasAnyAuthority("user")
//                .and()
//                .authorizeRequests().antMatchers("/admin/**", "/users/**", "/mail/**").hasAnyAuthority("admin")
//                .and()
//                .authorizeRequests().anyRequest().authenticated()
//                .and()
//                .addFilter(customAuthenticationFilter)
//                .addFilterAfter(new SimpleCORSFilter(), ChannelProcessingFilter.class)
//                .addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);


//        http.csrf().disable();
//        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
//        http.authorizeRequests().antMatchers("/login", "/signup").permitAll();
//        http.authorizeRequests().antMatchers("/home/**", "/cart/**", "/saveOrder/**", "/orders/**", "/placeOrder/**").hasAnyAuthority("user");
//        http.authorizeRequests().antMatchers("/admin/**", "/users/**", "/mail/**").hasAnyAuthority("admin");
//        http.authorizeRequests().anyRequest().authenticated();
//        http.addFilterBefore(new SimpleCORSFilter(), ChannelProcessingFilter.class);
//        http.addFilter(customAuthenticationFilter);
//        http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);

        http
                .cors().and().csrf().disable()
                .exceptionHandling().authenticationEntryPoint(customAuthenticationEntryPoint).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests().antMatchers("/login/**", "/signup/**", "/verify/**", "/generate/**", "/forgot/**", "/verifyCode/**", "/savePassword").permitAll()
                .antMatchers("/home/**", "/cart/**", "/saveOrder/**", "/orders/**", "/placeOrder/**").hasAnyAuthority("user")
                .antMatchers("/admin/**", "/users/**", "/mail/**", "/disableUser", "/enableUser", "/checkUser").hasAnyAuthority("admin")
                .anyRequest().authenticated().and()
                .exceptionHandling().accessDeniedHandler(customAccessDeniedHandler)
                .authenticationEntryPoint(customAuthenticationEntryPoint).and()
                .addFilter(customAuthenticationFilter)
                .addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
//        http.addFilter(customAuthenticationFilter);
//        http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
//        http.addFilterBefore(new SimpleCORSFilter(), ChannelProcessingFilter.class);

    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public CorsFilter corsFilter() {

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        //config.setAllowCredentials(true); // you USUALLY want this
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("HEAD");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("PATCH");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
