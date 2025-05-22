package com.dmtryii.backend.dto;

import com.dmtryii.backend.entity.enums.EBodyType;
import com.dmtryii.backend.entity.enums.EColor;
import com.dmtryii.backend.entity.enums.EDrivetrainType;
import com.dmtryii.backend.entity.enums.EVehicleStatus;
import com.dmtryii.backend.entity.enums.ETechnicalCondition;
import com.dmtryii.backend.entity.enums.ETransmissionType;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleDto extends DefaultAuditDto {

    @NotBlank(message = "Vehicle name must not be blank")
    @Size(max = 100, message = "Vehicle name must not exceed 100 characters")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private Double price;

    @NotNull(message = "Status is required")
    private EVehicleStatus status;

    @NotNull(message = "Color is required")
    private EColor color;

    @NotNull(message = "Body type is required")
    private EBodyType bodyType;

    @NotNull(message = "Drivetrain type is required")
    private EDrivetrainType drivetrainType;

    @NotNull(message = "Technical condition is required")
    private ETechnicalCondition technicalCondition;

    @NotNull(message = "Transmission type condition is required")
    private ETransmissionType transmissionType;

    @NotNull(message = "Manufacturing year is required")
    @Min(value = 1886, message = "Year must be no earlier than 1886")
    @Max(value = 2025, message = "Year must be realistic")
    private Integer years;

    @NotBlank(message = "License plate must not be blank")
    @Size(max = 20, message = "License plate must not exceed 20 characters")
    private String licensePlate;

    @NotBlank(message = "VIN code must not be blank")
    @Size(min = 17, max = 17, message = "VIN code must be exactly 17 characters")
    private String vinCode;

    @NotNull(message = "Mileage is required")
    @Min(value = 0, message = "Mileage must not be negative")
    private Integer mileage;

    @NotNull(message = "Max speed is required")
    @Min(value = 1, message = "Max speed must be greater than 0")
    private Integer maxSpeed;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    private List<VehicleMediaFileDto> vehicleMediaFile;

    private UUID manufacturerId;
    private ManufacturerDto manufacturer;

    private UUID engineId;
    private EngineDto engine;

}
