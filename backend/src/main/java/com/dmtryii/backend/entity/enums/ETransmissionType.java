package com.dmtryii.backend.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ETransmissionType {
    MANUAL("Manual"),
    AUTOMATIC("Automatic"),
    SEMI_AUTOMATIC("Semi-Automatic"),
    CVT("CVT (Continuously Variable Transmission)"),
    DUAL_CLUTCH("Dual Clutch (DSG)"),
    OTHER("Other");

    private final String description;
}
