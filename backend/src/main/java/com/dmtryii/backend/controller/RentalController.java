package com.dmtryii.backend.controller;

import com.dmtryii.backend.dto.RentalDto;
import com.dmtryii.backend.dto.TitleValueDto;
import com.dmtryii.backend.entity.enums.ERentalStatus;
import com.dmtryii.backend.payload.request.RentalRequest;
import com.dmtryii.backend.payload.response.RentalResponse;
import com.dmtryii.backend.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import static com.dmtryii.backend.payload.response.ResponseHandler.generateSuccessfulResponse;

@RestController
@RequestMapping("/api/v1/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;
    private final ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody RentalRequest request) {
        return generateSuccessfulResponse(
                modelMapper.map(rentalService.create(request), RentalResponse.class),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable UUID id, @RequestBody RentalRequest request) {
        return generateSuccessfulResponse(
                modelMapper.map(rentalService.update(id, request), RentalResponse.class),
                HttpStatus.OK
        );
    }

    @PatchMapping("/{id}/change-status")
    public ResponseEntity<Object> changeStatus(@PathVariable UUID id, @RequestParam ERentalStatus status) {
        return generateSuccessfulResponse(
                modelMapper.map(rentalService.changeStatus(id, status), RentalResponse.class),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<Object> getAll(@RequestParam(required = false) ERentalStatus status) {
        List<RentalDto> rentals;

        if (status != null) {
            rentals = rentalService.getAllByStatus(status).stream()
                    .map(rental -> modelMapper.map(rental, RentalDto.class))
                    .toList();
        } else {
            rentals = rentalService.getAll().stream()
                    .map(rental -> modelMapper.map(rental, RentalDto.class))
                    .toList();
        }

        return generateSuccessfulResponse(rentals, HttpStatus.OK);
    }

    @GetMapping("/personal")
    public ResponseEntity<Object> getAllPersonal() {
        return generateSuccessfulResponse(
                rentalService.getAllPersonal().stream()
                        .map(rental -> modelMapper.map(rental, RentalDto.class))
                        .toList(),
                HttpStatus.OK
        );
    }

    @GetMapping("/statuses")
    public ResponseEntity<Object> getStatuses() {
        return generateSuccessfulResponse(
                Arrays.stream(ERentalStatus.values())
                        .map(status -> new TitleValueDto(status.getDescription(), status.name()))
                        .sorted(Comparator.comparing(TitleValueDto::getTitle))
                        .toList(),
                HttpStatus.OK
        );
    }
}
