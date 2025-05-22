package com.dmtryii.backend.controller;

import com.dmtryii.backend.dto.DiscountDto;
import com.dmtryii.backend.service.DiscountService;
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
@RequestMapping("/api/v1/discounts")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;
    private final ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody DiscountDto dto) {
        return generateSuccessfulResponse(
                modelMapper.map(discountService.create(dto), DiscountDto.class),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable UUID id, @RequestBody DiscountDto dto) {
        return generateSuccessfulResponse(
                modelMapper.map(discountService.update(id, dto), DiscountDto.class),
                HttpStatus.OK
        );
    }

    @GetMapping("/personal")
    public ResponseEntity<Object> getAllPersonal() {
        return generateSuccessfulResponse(
                discountService.getPersonal().stream()
                        .map(discount -> modelMapper.map(discount, DiscountDto.class))
                        .toList(),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<Object> getAll() {
        return generateSuccessfulResponse(
                discountService.getAll().stream()
                        .map(discount -> modelMapper.map(discount, DiscountDto.class))
                        .toList(),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable UUID id) {
        discountService.delete(id);
        return generateSuccessfulResponse(
                "Deleted successful",
                HttpStatus.NO_CONTENT
        );
    }

}
