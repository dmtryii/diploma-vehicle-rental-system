package com.dmtryii.backend.controller;

import com.dmtryii.backend.dto.ManufacturerDto;
import com.dmtryii.backend.service.ManufacturerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.UUID;

import static com.dmtryii.backend.payload.response.ResponseHandler.generateSuccessfulResponse;

@RequiredArgsConstructor
@RequestMapping("/api/v1/manufacturers")
@RestController
public class ManufacturerController {

    private final ManufacturerService manufacturerService;
    private final ModelMapper modelMapper;

    @GetMapping("/{id}")
    public ResponseEntity<Object> getAll(@PathVariable UUID id) {
        return generateSuccessfulResponse(
                modelMapper.map(manufacturerService.get(id), ManufacturerDto.class),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<Object> getAll() {
        return generateSuccessfulResponse(
                manufacturerService.getAll().stream()
                        .map(manufacturer -> modelMapper.map(manufacturer, ManufacturerDto.class))
                        .sorted(Comparator.comparing(ManufacturerDto::getName))
                        .toList(),
                HttpStatus.OK
        );
    }

}
