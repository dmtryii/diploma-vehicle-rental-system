package com.dmtryii.backend.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ERentalStatus {
    REJECTED("Rejected"),
    AWAITING_CONFIRMATION("Awaiting confirmation"),
    AWAITING_PAYMENT("Awaiting payment"),
    ACTIVE("Active"),
    COMPLETED("Completed");

    private final String description;
}
