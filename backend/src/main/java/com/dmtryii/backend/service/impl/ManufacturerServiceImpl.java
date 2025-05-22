package com.dmtryii.backend.service.impl;

import com.dmtryii.backend.entity.Manufacturer;
import com.dmtryii.backend.repository.ManufacturerRepository;
import com.dmtryii.backend.service.ManufacturerService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ManufacturerServiceImpl implements ManufacturerService {

    private final ManufacturerRepository manufacturerRepository;

    @Override
    public Manufacturer get(UUID id) {
        return manufacturerRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Manufacturer not found by id " + id)
        );
    }

    @Override
    public List<Manufacturer> getAll() {
        return manufacturerRepository.findAll();
    }
}
