package com.dmtryii.backend.service.impl;

import com.dmtryii.backend.entity.User;
import com.dmtryii.backend.repository.UserRepository;
import com.dmtryii.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User get(UUID id) {
        return userRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("User not found by id: " + id)
        );
    }

    @Override
    public User getCurrent() {
        var currentUser = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Current user not found"));
    }

    @Override
    public void saveAll(List<User> users) {
        userRepository.saveAll(users);
    }

    @Override
    public List<User> getByIds(List<UUID> ids) {
        return userRepository.findAllById(ids);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }
}
