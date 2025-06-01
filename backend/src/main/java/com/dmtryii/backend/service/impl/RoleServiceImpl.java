package com.dmtryii.backend.service.impl;

import com.dmtryii.backend.entity.Role;
import com.dmtryii.backend.repository.RoleRepository;
import com.dmtryii.backend.service.RoleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public List<Role> getAll() {
        return roleRepository.findAll();
    }

    @Override
    public Role get(UUID id) {
        return roleRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Role not found by id: " + id)
        );
    }

    @Override
    public List<Role> getByIds(List<UUID> ids) {
        return roleRepository.findAllById(ids);
    }
}
