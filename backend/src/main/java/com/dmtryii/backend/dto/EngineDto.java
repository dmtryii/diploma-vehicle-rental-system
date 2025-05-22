package com.dmtryii.backend.dto;

import com.dmtryii.backend.entity.enums.EFuelType;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EngineDto extends DefaultAuditDto {
    @NotBlank(message = "Engine name must not be blank")
    @Size(max = 100, message = "Engine name must not exceed 100 characters")
    private String name;

    @NotNull(message = "Fuel type is required")
    private EFuelType fuelType;

    @NotNull(message = "Engine capacity is required")
    @DecimalMin(value = "0.1", message = "Engine capacity must be greater than 0")
    private Double capacity;

    @NotNull(message = "Engine power is required")
    @Min(value = 1, message = "Engine power must be greater than 0")
    private Integer power;
}
