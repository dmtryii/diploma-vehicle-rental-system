package com.dmtryii.backend.service;

import com.dmtryii.backend.dto.DiscountDto;
import com.dmtryii.backend.entity.Discount;

import java.util.List;
import java.util.UUID;

public interface DiscountService {
    Discount get(UUID id);
    List<Discount> getPersonal();
    Discount create(DiscountDto dto);
    Discount update(UUID id, DiscountDto dto);
    List<Discount> getAll();
    void delete(UUID id);
}
