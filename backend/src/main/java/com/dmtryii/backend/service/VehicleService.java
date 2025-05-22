package com.dmtryii.backend.service;

import com.dmtryii.backend.dto.VehicleDto;
import com.dmtryii.backend.dto.VehicleMediaFileDto;
import com.dmtryii.backend.entity.Vehicle;
import com.dmtryii.backend.entity.VehicleMediaFile;
import com.dmtryii.backend.entity.enums.EBodyType;
import com.dmtryii.backend.entity.enums.EColor;
import com.dmtryii.backend.entity.enums.EDrivetrainType;
import com.dmtryii.backend.entity.enums.EVehicleStatus;
import com.dmtryii.backend.entity.enums.ETechnicalCondition;
import com.dmtryii.backend.entity.enums.ETransmissionType;

import java.util.List;
import java.util.UUID;

public interface VehicleService {
    Vehicle get(UUID id);
    List<Vehicle> getAll();
    Vehicle create(VehicleDto dto);
    List<VehicleMediaFile> addMedia(UUID id, VehicleMediaFileDto dto);
    void deleteMedia(UUID media);
    Vehicle update(UUID id, VehicleDto dto);
    void delete(UUID id);

    List<Vehicle> getAllFiltered(
            String name,
            EVehicleStatus status,
            EColor color,
            EBodyType bodyType,
            EDrivetrainType drivetrainType,
            ETechnicalCondition technicalCondition,
            ETransmissionType transmissionType,
            Double priceMin,
            Double priceMax,
            Integer yearMin,
            Integer yearMax,
            Integer mileageMin,
            Integer mileageMax,
            Integer maxSpeedMin,
            Integer maxSpeedMax,
            UUID manufacturerId,
            UUID engineId
    );
}
