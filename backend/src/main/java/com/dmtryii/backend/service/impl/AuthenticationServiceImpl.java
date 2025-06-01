package com.dmtryii.backend.service.impl;

import com.dmtryii.backend.dto.UserDto;
import com.dmtryii.backend.payload.request.AuthenticationRequest;
import com.dmtryii.backend.payload.request.RegisterRequest;
import com.dmtryii.backend.payload.response.AuthenticationResponse;
import com.dmtryii.backend.entity.Role;
import com.dmtryii.backend.entity.User;
import com.dmtryii.backend.repository.RoleRepository;
import com.dmtryii.backend.repository.UserRepository;
import com.dmtryii.backend.security.JwtService;
import com.dmtryii.backend.service.AuthenticationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .birthday(request.getBirthday())
                .roles(List.of(getDefaultRole()))
                .build();

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());

        var jwtToken = jwtService.generateToken(userDetails);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(modelMapper.map(user, UserDto.class))
                .build();
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());

        var jwtToken = jwtService.generateToken(userDetails);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(modelMapper.map(user, UserDto.class))
                .build();
    }

    private Role getDefaultRole() {
        return roleRepository.findByName("ROLE_USER").orElseThrow(
                () -> new EntityNotFoundException("Base role not found")
        );
    }
}
