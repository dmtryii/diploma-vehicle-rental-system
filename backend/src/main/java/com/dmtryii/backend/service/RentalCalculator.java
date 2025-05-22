package com.dmtryii.backend.service;

import com.dmtryii.backend.entity.Rental;

import java.util.UUID;

public interface RentalCalculator {
    double calculateTotalCost(Rental rental, UUID discountId);
}
