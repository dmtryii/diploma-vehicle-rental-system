package com.dmtryii.backend.controller;

import com.dmtryii.backend.dto.EngineDto;
import com.dmtryii.backend.dto.TitleValueDto;
import com.dmtryii.backend.entity.enums.EFuelType;
import com.dmtryii.backend.service.EngineService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Comparator;
import java.util.UUID;

import static com.dmtryii.backend.payload.response.ResponseHandler.generateSuccessfulResponse;

@RequiredArgsConstructor
@RequestMapping("/api/v1/engines")
@RestController
public class EngineController {

    private final EngineService engineService;
    private final ModelMapper modelMapper;

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable UUID id) {
        return generateSuccessfulResponse(
                modelMapper.map(engineService.get(id), EngineDto.class),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<Object> getAll() {
        return generateSuccessfulResponse(
                engineService.getAll().stream()
                        .map(engine -> modelMapper.map(engine, EngineDto.class))
                        .sorted(Comparator.comparing(EngineDto::getName))
                        .toList(),
                HttpStatus.OK
        );
    }

    @GetMapping("/fuel-types")
    public ResponseEntity<Object> getFuelTypes() {
        return generateSuccessfulResponse(
                Arrays.stream(EFuelType.values())
                        .map(status -> new TitleValueDto(status.getDescription(), status.name()))
                        .sorted(Comparator.comparing(TitleValueDto::getTitle))
                        .toList(),
                HttpStatus.OK
        );
    }

}
