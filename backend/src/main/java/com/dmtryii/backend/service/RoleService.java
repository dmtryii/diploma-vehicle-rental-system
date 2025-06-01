package com.dmtryii.backend.service;

import com.dmtryii.backend.entity.Role;

import java.util.List;
import java.util.UUID;

public interface RoleService {
    List<Role> getAll();
    Role get(UUID id);
    List<Role> getByIds(List<UUID> ids);
}
