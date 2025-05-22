package com.dmtryii.backend.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EVehicleStatus {
    AVAILABLE("Available"),
    HIDDEN("Hidden"),
    RENTED("Rented");

    private final String description;
}
