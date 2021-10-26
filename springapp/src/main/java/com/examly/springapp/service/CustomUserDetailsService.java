package com.examly.springapp.service;

import com.examly.springapp.audit.RegularAuditModel;
import com.examly.springapp.audit.RegularAuditService;
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

    @Autowired
    private RegularAuditService regularAuditService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel userModel = userRepository.findByEmail(username);
        regularAuditService.audit(new RegularAuditModel("Request to load user",  username, "", true));
        if (userModel == null) {
            regularAuditService.audit(new RegularAuditModel("Request to load user",  username, "User not found", false));
            throw new UsernameNotFoundException("User not found");
        } else {
            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("u_id=" + userModel.getUserId()));
            authorities.add(new SimpleGrantedAuthority("mfa=" + userModel.isMfa()));
            authorities.add(new SimpleGrantedAuthority("totp=" + userModel.isVerifiedForTOTP()));
            authorities.add(new SimpleGrantedAuthority("active=" + userModel.isActive()));
            authorities.add(new SimpleGrantedAuthority("role=" + userModel.getRole()));
            regularAuditService.audit(new RegularAuditModel("Request to load user",  username, "User info loaded", true));
            return new User(userModel.getEmail(), userModel.getPassword(), authorities);
        }
    }
}
