package com.dmtryii.backend.service;

import com.dmtryii.backend.dto.EngineDto;
import com.dmtryii.backend.entity.Engine;

import java.util.List;
import java.util.UUID;

public interface EngineService {
    Engine get(UUID id);
    List<Engine> getAll();
    Engine create(EngineDto dto);
    Engine update(UUID id, EngineDto dto);
    void delete(UUID id);
}
