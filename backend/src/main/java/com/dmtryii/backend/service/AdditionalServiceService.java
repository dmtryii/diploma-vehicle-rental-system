package com.dmtryii.backend.service;

import com.dmtryii.backend.dto.AdditionalServiceDto;
import com.dmtryii.backend.entity.AdditionalService;

import java.util.List;
import java.util.UUID;

public interface AdditionalServiceService {
    AdditionalService get(UUID id);
    AdditionalService create(AdditionalServiceDto dto);
    AdditionalService update(UUID id, AdditionalServiceDto dto);
    List<AdditionalService> getByIds(List<UUID> ids);
    List<AdditionalService> getAll();
    void delete(UUID id);
}
