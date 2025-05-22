package com.dmtryii.backend.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EFuelType {
    GASOLINE("Gasoline"),         // Бензин
    DIESEL("Diesel"),             // Дизель
    ELECTRIC("Electric"),         // Електричний
    HYBRID("Hybrid"),             // Гібрид
    LPG("LPG"),                   // Природний газ (LPG)
    CNG("CNG"),                   // Стиснений природний газ
    OTHER("Other");               // Інше

    private final String description;
}
