package com.dmtryii.backend.config;

import com.dmtryii.backend.dto.VehicleDto;
import com.dmtryii.backend.entity.Vehicle;
import com.dmtryii.backend.repository.UserRepository;
import com.dmtryii.backend.security.UserDetailsSecurity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class AppConfig {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> new UserDetailsSecurity(
                userRepository.findByUsername(username).orElseThrow(
                        () -> new UsernameNotFoundException("User not found by username: " + username)
                )
        );
    }

    @Bean
    public AuthenticationProvider authConfigProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ModelMapper modelMapper() {
        var modelMapper = new ModelMapper();
        modelMapper.typeMap(Vehicle.class, VehicleDto.class)
                .addMappings(mapper -> mapper.skip(VehicleDto::setVehicleMediaFile));
        return modelMapper;
    }
}
