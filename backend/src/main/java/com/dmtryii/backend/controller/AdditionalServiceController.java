package com.dmtryii.backend.controller;

import com.dmtryii.backend.dto.AdditionalServiceDto;
import com.dmtryii.backend.service.AdditionalServiceService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import static com.dmtryii.backend.payload.response.ResponseHandler.generateSuccessfulResponse;

@RestController
@RequestMapping("/api/v1/additional-services")
@RequiredArgsConstructor
public class AdditionalServiceController {

    private final AdditionalServiceService additionalServiceService;
    private final ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody AdditionalServiceDto dto) {
        return generateSuccessfulResponse(
                modelMapper.map(additionalServiceService.create(dto), AdditionalServiceDto.class),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable UUID id,
                                         @RequestBody AdditionalServiceDto dto) {
        return generateSuccessfulResponse(
                modelMapper.map(additionalServiceService.update(id, dto), AdditionalServiceDto.class),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<Object> getAll() {
        return generateSuccessfulResponse(
                additionalServiceService.getAll().stream()
                        .map(service -> modelMapper.map(service, AdditionalServiceDto.class))
                        .toList(),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable UUID id) {
        additionalServiceService.delete(id);
        return generateSuccessfulResponse(
                "Deleted successful",
                HttpStatus.NO_CONTENT
        );
    }

}
