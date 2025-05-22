package com.dmtryii.backend.service.impl;

import com.dmtryii.backend.dto.EngineDto;
import com.dmtryii.backend.entity.Engine;
import com.dmtryii.backend.repository.EngineRepository;
import com.dmtryii.backend.service.EngineService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class EngineServiceImpl implements EngineService {

    private final EngineRepository engineRepository;

    @Override
    public Engine get(UUID id) {
        return engineRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Engine not found by id: " + id)
        );
    }

    @Override
    public List<Engine> getAll() {
        return engineRepository.findAll();
    }

    @Override
    public Engine create(EngineDto dto) {
        var engine = Engine.builder()
                .name(dto.getName())
                .fuelType(dto.getFuelType())
                .capacity(dto.getCapacity())
                .power(dto.getPower())
                .build();
        return engineRepository.save(engine);
    }

    @Override
    public Engine update(UUID id, EngineDto dto) {
        return null;
    }

    @Override
    public void delete(UUID id) {
        var engine = get(id);
        engineRepository.delete(engine);
    }
}
