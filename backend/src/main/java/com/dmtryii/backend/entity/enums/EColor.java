package com.dmtryii.backend.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EColor {
    WHITE("White"),
    BLACK("Black"),
    SILVER("Silver"),
    GRAY("Gray"),
    RED("Red"),
    BLUE("Blue"),
    GREEN("Green"),
    YELLOW("Yellow"),
    ORANGE("Orange"),
    BROWN("Brown"),
    PURPLE("Purple"),
    PINK("Pink"),
    GOLD("Gold"),
    BEIGE("Beige"),
    OTHER("Other");

    private final String description;
}
