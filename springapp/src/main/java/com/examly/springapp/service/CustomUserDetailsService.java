package com.examly.springapp.service;

import com.examly.springapp.mfa.TotpManager;
import com.examly.springapp.model.UserModel;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TotpManager totpManager;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel userModel = userRepository.findByEmail(username);
        if(userModel == null) {
            throw new UsernameNotFoundException("User not found");
        }
        else {
            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            System.out.println(username);
            authorities.add(new SimpleGrantedAuthority("u_id=" + userModel.getUserId()));
            authorities.add(new SimpleGrantedAuthority("mfa=" + String.valueOf(userModel.isMfa())));
            authorities.add(new SimpleGrantedAuthority("totp=" + String.valueOf(userModel.isVerifiedForTOTP())));
            authorities.add(new SimpleGrantedAuthority("active=" + String.valueOf(userModel.isActive())));
            authorities.add(new SimpleGrantedAuthority("role=" + userModel.getRole()));
            System.out.println(authorities.size());
            System.out.println(userModel.getUserId() + " " + String.valueOf(userModel.isMfa() + " " + userModel.isVerifiedForTOTP() + " " + userModel.getRole()));
            return new User(userModel.getEmail(), userModel.getPassword(), authorities);
        }
    }
}
