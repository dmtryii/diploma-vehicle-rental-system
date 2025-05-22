package com.dmtryii.backend.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EDrivetrainType {
    FWD("Front-Wheel Drive"),
    RWD("Rear-Wheel Drive"),
    AWD("All-Wheel Drive"),
    FOUR_WD("Four-Wheel Drive");

    private final String description;
}
