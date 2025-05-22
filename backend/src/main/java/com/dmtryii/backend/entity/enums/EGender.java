package com.dmtryii.backend.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EGender {
    MALE("Male"),
    FEMALE("Female"),
    OTHER("Other");

    private final String description;
}
