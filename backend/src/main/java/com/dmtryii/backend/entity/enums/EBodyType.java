package com.dmtryii.backend.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EBodyType {
    SEDAN("Sedan"),
    HATCHBACK("Hatchback"),
    LIFTBACK("Liftback"),
    STATION_WAGON("Station Wagon"),
    SUV("SUV"),
    COUPE("Coupe"),
    CONVERTIBLE("Convertible"),
    PICKUP("Pickup"),
    VAN("Van"),
    MINIVAN("Minivan"),
    ROADSTER("Roadster"),
    FASTBACK("Fastback"),
    TARGA("Targa"),
    MICROCAR("Microcar"),
    OTHER("Other");

    private final String description;
}
