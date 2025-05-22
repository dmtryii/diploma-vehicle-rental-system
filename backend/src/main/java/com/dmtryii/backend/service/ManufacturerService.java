package com.dmtryii.backend.service;

import com.dmtryii.backend.entity.Manufacturer;

import java.util.List;
import java.util.UUID;

public interface ManufacturerService {
    Manufacturer get(UUID id);
    List<Manufacturer> getAll();
}
