package com.dmtryii.backend.service;

import com.dmtryii.backend.entity.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User get(UUID id);
    User getCurrent();
    List<User> getByIds(List<UUID> ids);
    List<User> getAll();
    void saveAll(List<User> users);
}
