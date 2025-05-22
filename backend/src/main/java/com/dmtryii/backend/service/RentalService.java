package com.dmtryii.backend.service;

import com.dmtryii.backend.entity.Rental;
import com.dmtryii.backend.entity.enums.ERentalStatus;
import com.dmtryii.backend.payload.request.RentalRequest;

import java.util.List;
import java.util.UUID;

public interface RentalService {
    Rental get(UUID id);
    Rental create(RentalRequest request);
    Rental update(UUID id, RentalRequest request);
    Rental changeStatus(UUID id, ERentalStatus status);
    List<Rental> getAllPersonal();
    List<Rental> getAllByStatus(ERentalStatus status);
    List<Rental> getAll();
}
