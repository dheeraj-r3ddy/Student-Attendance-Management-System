package com.attendance.service;

import com.attendance.dto.LoginRequest;
import com.attendance.dto.LoginResponse;
import com.attendance.model.User;
import com.attendance.repository.UserRepository;
import com.attendance.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

            LoginResponse.UserDTO userDTO = new LoginResponse.UserDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getRole().name().toLowerCase()
            );

            return new LoginResponse(true, "Login successful", userDTO, token);

        } catch (AuthenticationException e) {
            return new LoginResponse(false, "Invalid credentials", null, null);
        }
    }

    public User createUser(String username, String password, User.Role role) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        return userRepository.save(user);
    }
}
