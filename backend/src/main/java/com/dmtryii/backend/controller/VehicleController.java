package com.dmtryii.backend.controller;

import com.dmtryii.backend.dto.TitleValueDto;
import com.dmtryii.backend.dto.VehicleDto;
import com.dmtryii.backend.dto.VehicleMediaFileDto;
import com.dmtryii.backend.entity.Vehicle;
import com.dmtryii.backend.entity.enums.EBodyType;
import com.dmtryii.backend.entity.enums.EColor;
import com.dmtryii.backend.entity.enums.EDrivetrainType;
import com.dmtryii.backend.entity.enums.EVehicleStatus;
import com.dmtryii.backend.entity.enums.ETechnicalCondition;
import com.dmtryii.backend.entity.enums.ETransmissionType;
import com.dmtryii.backend.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import static com.dmtryii.backend.payload.response.ResponseHandler.generateSuccessfulResponse;

@RequiredArgsConstructor
@RequestMapping("/api/v1/vehicles")
@RestController
public class VehicleController {

    private final VehicleService vehicleService;
    private final ModelMapper modelMapper;

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<Object> getById(@PathVariable UUID id) {
        return generateSuccessfulResponse(
                mapToDto(vehicleService.get(id)),
                HttpStatus.OK
        );
    }

    @GetMapping
    @Transactional
    public ResponseEntity<Object> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) EVehicleStatus status,
            @RequestParam(required = false) EColor color,
            @RequestParam(required = false) EBodyType bodyType,
            @RequestParam(required = false) EDrivetrainType drivetrainType,
            @RequestParam(required = false) ETechnicalCondition technicalCondition,
            @RequestParam(required = false) ETransmissionType transmissionType,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) Integer yearMin,
            @RequestParam(required = false) Integer yearMax,
            @RequestParam(required = false) Integer mileageMin,
            @RequestParam(required = false) Integer mileageMax,
            @RequestParam(required = false) Integer maxSpeedMin,
            @RequestParam(required = false) Integer maxSpeedMax,
            @RequestParam(required = false) UUID manufacturerId,
            @RequestParam(required = false) UUID engineId
    ) {
        var filteredVehicles = vehicleService.getAllFiltered(
                name, status, color, bodyType, drivetrainType, technicalCondition, transmissionType,
                priceMin, priceMax, yearMin, yearMax,
                mileageMin, mileageMax, maxSpeedMin, maxSpeedMax,
                manufacturerId, engineId
        );

        return generateSuccessfulResponse(
                filteredVehicles.stream()
                        .map(this::mapToDto)
                        .filter(v -> !v.getStatus().equals(EVehicleStatus.HIDDEN))
                        .sorted(Comparator
                                .comparing((VehicleDto v) -> !v.getStatus().equals(EVehicleStatus.AVAILABLE))
                                .thenComparing(VehicleDto::getName)
                        )
                        .toList(),
                HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<Object> create(@Valid @RequestBody VehicleDto dto) {
        return generateSuccessfulResponse(
                modelMapper.map(vehicleService.create(dto), VehicleDto.class),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable UUID id,
                                         @Valid @RequestBody VehicleDto dto) {
        return generateSuccessfulResponse(
                modelMapper.map(vehicleService.update(id, dto), VehicleDto.class),
                HttpStatus.OK
        );
    }

    @PostMapping("/{id}/media")
    @Transactional
    public ResponseEntity<Object> addMedia(@PathVariable UUID id,
                                           @RequestParam("file") MultipartFile file) throws IOException {
        var mediaFile = VehicleMediaFileDto.builder()
                .name(file.getOriginalFilename())
                .contentType(file.getContentType())
                .data(file.getBytes())
                .build();
        return generateSuccessfulResponse(
                vehicleService.addMedia(id, mediaFile).stream()
                        .map(mf -> modelMapper.map(mf, VehicleMediaFileDto.class))
                        .toList(),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}/media")
    public ResponseEntity<Object> deleteMedia(@PathVariable UUID id) {
        vehicleService.deleteMedia(id);
        return generateSuccessfulResponse(
                "Delete successful!",
                HttpStatus.NO_CONTENT
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable UUID id) {
        vehicleService.delete(id);
        return generateSuccessfulResponse(
                "Delete successful!",
                HttpStatus.NO_CONTENT
        );
    }

    @GetMapping("/statuses")
    public ResponseEntity<Object> getStates() {
        return generateSuccessfulResponse(
                Arrays.stream(EVehicleStatus.values())
                        .map(status -> new TitleValueDto(status.getDescription(), status.name()))
                        .sorted(Comparator.comparing(TitleValueDto::getTitle))
                        .toList(),
                HttpStatus.OK
        );
    }

    @GetMapping("/colors")
    public ResponseEntity<Object> getColors() {
        return generateSuccessfulResponse(
                Arrays.stream(EColor.values())
                        .map(status -> new TitleValueDto(status.getDescription(), status.name()))
                        .sorted(Comparator.comparing(TitleValueDto::getTitle))
                        .toList(),
                HttpStatus.OK
        );
    }

    @GetMapping("/body-types")
    public ResponseEntity<Object> getBodyTypes() {
        return generateSuccessfulResponse(
                Arrays.stream(EBodyType.values())
                        .map(status -> new TitleValueDto(status.getDescription(), status.name()))
                        .sorted(Comparator.comparing(TitleValueDto::getTitle))
                        .toList(),
                HttpStatus.OK
        );
    }

    @GetMapping("/drivetrain-types")
    public ResponseEntity<Object> getDrivetrainTypes() {
        return generateSuccessfulResponse(
                Arrays.stream(EDrivetrainType.values())
                        .map(status -> new TitleValueDto(status.getDescription(), status.name()))
                        .sorted(Comparator.comparing(TitleValueDto::getTitle))
                        .toList(),
                HttpStatus.OK
        );
    }

    @GetMapping("/technical-conditions")
    public ResponseEntity<Object> getTechnicalConditions() {
        return generateSuccessfulResponse(
                Arrays.stream(ETechnicalCondition.values())
                        .map(status -> new TitleValueDto(status.getDescription(), status.name()))
                        .sorted(Comparator.comparing(TitleValueDto::getTitle))
                        .toList(),
                HttpStatus.OK
        );
    }

    @GetMapping("/transmission-types")
    public ResponseEntity<Object> getTransmissionTypes() {
        return generateSuccessfulResponse(
                Arrays.stream(ETransmissionType.values())
                        .map(status -> new TitleValueDto(status.getDescription(), status.name()))
                        .sorted(Comparator.comparing(TitleValueDto::getTitle))
                        .toList(),
                HttpStatus.OK
        );
    }

    private VehicleDto mapToDto(Vehicle vehicle) {
        VehicleDto dto = modelMapper.map(vehicle, VehicleDto.class);

        if (vehicle.getVehicleMediaFile() != null) {
            List<VehicleMediaFileDto> mediaFileDtos = vehicle.getVehicleMediaFile().stream()
                    .map(media -> modelMapper.map(media, VehicleMediaFileDto.class))
                    .toList();
            dto.setVehicleMediaFile(mediaFileDtos);
        }

        return dto;
    }
}
