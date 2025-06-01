package com.dmtryii.backend.service.impl;

import com.dmtryii.backend.entity.User;
import com.dmtryii.backend.repository.UserRepository;
import com.dmtryii.backend.service.RoleService;
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
    private final RoleService roleService;

    @Override
    public User get(UUID id) {
        return userRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("User not found by id: " + id)
        );
    }

    @Override
    public User getCurrent() {
        var principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails userDetails) {
            var username = userDetails.getUsername();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new EntityNotFoundException("Current user not found"));
        }

        return null;
    }

    @Override
    public void saveAll(List<User> users) {
        userRepository.saveAll(users);
    }

    @Override
    public void delete(UUID id) {
        var user = get(id);
        userRepository.delete(user);
    }

    @Override
    public List<User> getByIds(List<UUID> ids) {
        return userRepository.findAllById(ids);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public void changeRole(UUID id, List<UUID> roleIds) {
        var user = get(id);
        var roles = roleService.getByIds(roleIds);
        user.setRoles(roles);
        userRepository.save(user);
    }
}
