package com.dmtryii.backend.payload.request;

import com.dmtryii.backend.entity.enums.EBodyType;
import com.dmtryii.backend.entity.enums.EColor;
import com.dmtryii.backend.entity.enums.EDrivetrainType;
import com.dmtryii.backend.entity.enums.ETechnicalCondition;
import com.dmtryii.backend.entity.enums.ETransmissionType;
import com.dmtryii.backend.entity.enums.EVehicleStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class VehicleFilterRequest {
    private String name;
    private EVehicleStatus status;
    private EColor color;
    private EBodyType bodyType;
    private EDrivetrainType drivetrainType;
    private ETechnicalCondition technicalCondition;
    private ETransmissionType transmissionType;
    private Double priceMin;
    private Double priceMax;
    private Integer yearMin;
    private Integer yearMax;
    private Integer mileageMin;
    private Integer mileageMax;
    private Integer maxSpeedMin;
    private Integer maxSpeedMax;
    private UUID manufacturerId;
    private UUID engineId;
}
