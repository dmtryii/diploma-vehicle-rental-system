package com.dmtryii.backend.service.impl;

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
import com.dmtryii.backend.repository.VehicleMediaFileRepository;
import com.dmtryii.backend.repository.VehicleRepository;
import com.dmtryii.backend.service.EngineService;
import com.dmtryii.backend.service.ManufacturerService;
import com.dmtryii.backend.service.VehicleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMediaFileRepository vehicleMediaFileRepository;
    private final ManufacturerService manufacturerService;
    private final EngineService engineService;
    private final ModelMapper modelMapper;

    @Override
    public Vehicle get(UUID id) {
        return vehicleRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Vehicle not found by id: " + id)
        );
    }

    @Override
    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    @Override
    @Transactional
    public Vehicle create(VehicleDto dto) {
        var vehicle = Vehicle.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .status(dto.getStatus())
                .color(dto.getColor())
                .bodyType(dto.getBodyType())
                .drivetrainType(dto.getDrivetrainType())
                .technicalCondition(dto.getTechnicalCondition())
                .transmissionType(dto.getTransmissionType())
                .years(dto.getYears())
                .licensePlate(dto.getLicensePlate())
                .vinCode(dto.getVinCode())
                .mileage(dto.getMileage())
                .maxSpeed(dto.getMaxSpeed())
                .description(dto.getDescription())
                .manufacturer(
                        dto.getManufacturerId() != null ? manufacturerService.get(dto.getManufacturerId()) : null
                )
                .engine(
                        dto.getEngineId() != null ? engineService.get(dto.getEngineId()) :
                                dto.getEngine() != null ? engineService.create(dto.getEngine()) : null
                )
                .build();
        return vehicleRepository.save(vehicle);
    }

    @Override
    @Transactional
    public List<VehicleMediaFile> addMedia(UUID id, VehicleMediaFileDto dto) {
        Vehicle vehicle = get(id);

        VehicleMediaFile mediaFile = new VehicleMediaFile();
        mediaFile.setName(dto.getName());
        mediaFile.setContentType(dto.getContentType());
        mediaFile.setData(dto.getData());
        mediaFile.setVehicle(vehicle);
        vehicleMediaFileRepository.save(mediaFile);
        vehicle.getVehicleMediaFile().add(mediaFile);
        vehicleRepository.save(vehicle);
        return vehicle.getVehicleMediaFile();
    }

    @Override
    public void deleteMedia(UUID mediaId) {
        VehicleMediaFile mediaFile = vehicleMediaFileRepository.findById(mediaId).orElseThrow(
                () -> new EntityNotFoundException("Media not found by id: " + mediaId)
        );
        vehicleMediaFileRepository.delete(mediaFile);
    }

    @Override
    @Transactional
    public Vehicle update(UUID id, VehicleDto dto) {
        Vehicle vehicle = get(id);

        vehicle.setName(dto.getName());
        vehicle.setPrice(dto.getPrice());
        vehicle.setStatus(dto.getStatus());
        vehicle.setColor(dto.getColor());
        vehicle.setBodyType(dto.getBodyType());
        vehicle.setDrivetrainType(dto.getDrivetrainType());
        vehicle.setTechnicalCondition(dto.getTechnicalCondition());
        vehicle.setTransmissionType(dto.getTransmissionType());
        vehicle.setYears(dto.getYears());
        vehicle.setLicensePlate(dto.getLicensePlate());
        vehicle.setVinCode(dto.getVinCode());
        vehicle.setMileage(dto.getMileage());
        vehicle.setMaxSpeed(dto.getMaxSpeed());
        vehicle.setDescription(dto.getDescription());

        if (dto.getManufacturerId() != null) {
            vehicle.setManufacturer(manufacturerService.get(dto.getManufacturerId()));
        }

        if (dto.getEngineId() != null) {
            vehicle.setEngine(engineService.get(dto.getEngineId()));
        } else if (dto.getEngine() != null) {
            vehicle.setEngine(engineService.create(dto.getEngine()));
        }

        return vehicleRepository.save(vehicle);
    }

    @Override
    public void delete(UUID id) {
        var vehicle = get(id);
        vehicleRepository.delete(vehicle);
    }

    @Override
    public List<Vehicle> getAllFiltered(String name,
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
                                        UUID engineId) {
        return vehicleRepository.findAll().stream()
                .filter(v -> name == null ||
                        v.getName().toLowerCase().contains(name.toLowerCase()) ||
                        (v.getManufacturer() != null &&
                                v.getManufacturer().getName().toLowerCase().contains(name.toLowerCase())))
                .filter(v -> status == null || v.getStatus() == status)
                .filter(v -> color == null || v.getColor() == color)
                .filter(v -> bodyType == null || v.getBodyType() == bodyType)
                .filter(v -> drivetrainType == null || v.getDrivetrainType() == drivetrainType)
                .filter(v -> technicalCondition == null || v.getTechnicalCondition() == technicalCondition)
                .filter(v -> transmissionType == null || v.getTransmissionType() == transmissionType)
                .filter(v -> priceMin == null || v.getPrice() >= priceMin)
                .filter(v -> priceMax == null || v.getPrice() <= priceMax)
                .filter(v -> yearMin == null || v.getYears() >= yearMin)
                .filter(v -> yearMax == null || v.getYears() <= yearMax)
                .filter(v -> mileageMin == null || v.getMileage() >= mileageMin)
                .filter(v -> mileageMax == null || v.getMileage() <= mileageMax)
                .filter(v -> maxSpeedMin == null || v.getMaxSpeed() >= maxSpeedMin)
                .filter(v -> maxSpeedMax == null || v.getMaxSpeed() <= maxSpeedMax)
                .filter(v -> manufacturerId == null || (v.getManufacturer() != null && manufacturerId.equals(v.getManufacturer().getId())))
                .filter(v -> engineId == null || (v.getEngine() != null && engineId.equals(v.getEngine().getId())))
                .collect(Collectors.toList());
    }
}
