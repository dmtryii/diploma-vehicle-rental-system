package com.dmtryii.backend.service.impl;

import com.dmtryii.backend.dto.AdditionalServiceDto;
import com.dmtryii.backend.entity.AdditionalService;
import com.dmtryii.backend.repository.AdditionalServiceRepository;
import com.dmtryii.backend.service.AdditionalServiceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AdditionalServiceServiceImpl implements AdditionalServiceService {

    private final AdditionalServiceRepository additionalServiceRepository;
    private final ModelMapper modelMapper;

    @Override
    public AdditionalService get(UUID id) {
        return additionalServiceRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Additional Service not found by id: " + id)
        );
    }

    @Override
    public AdditionalService create(AdditionalServiceDto dto) {
        var entity = modelMapper.map(dto, AdditionalService.class);
        return additionalServiceRepository.save(entity);
    }

    @Override
    public AdditionalService update(UUID id, AdditionalServiceDto dto) {
        var service = get(id);
        service.setName(dto.getName());
        service.setPrice(dto.getPrice());
        service.setDescription(dto.getDescription());
        return additionalServiceRepository.save(service);
    }

    @Override
    public List<AdditionalService> getByIds(List<UUID> ids) {
        List<AdditionalService> services = additionalServiceRepository.findAllById(ids);
        if (services.size() != ids.size()) {
            List<UUID> foundIds = services.stream()
                    .map(AdditionalService::getId)
                    .toList();
            ids.removeAll(foundIds);
            throw new EntityNotFoundException("Not Found: " + ids);
        }
        return additionalServiceRepository.findAllById(ids);
    }

    @Override
    public List<AdditionalService> getAll() {
        return additionalServiceRepository.findAll();
    }

    @Override
    public void delete(UUID id) {
        var service = get(id);
        additionalServiceRepository.delete(service);
    }
}
