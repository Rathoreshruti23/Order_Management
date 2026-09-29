package com.shrunity.Itfirm.Controller;

import com.shrunity.Itfirm.DTO.request.LoginRequest;
import com.shrunity.Itfirm.DTO.request.RegisterRequest;
import com.shrunity.Itfirm.DTO.response.AuthResponse;
import com.shrunity.Itfirm.Repository.UserRepository;
import com.shrunity.Itfirm.Service.CustomUserDetailsService;
import com.shrunity.Itfirm.entity.Role;
import com.shrunity.Itfirm.entity.User;
import com.shrunity.Itfirm.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
    @RequestMapping("/api/auth")
    @RequiredArgsConstructor
    public class AuthController {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;
        private final CustomUserDetailsService userDetailsService;

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
            if (userRepository.findByEmail(req.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already in use");
            }
            User user = new User();
            user.setEmail(req.getEmail());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setRole(Role.ROLE_USER);
            userRepository.save(user);
            return ResponseEntity.ok("Registered successfully");
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest req) {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

            UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(token));
        }
}
