package com.dmtryii.backend.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ETechnicalCondition {
    EXCELLENT("Excellent"),
    GOOD("Good"),
    FAIR("Fair"),
    POOR("Poor"),
    BROKEN("Broken");

    private final String description;
}
