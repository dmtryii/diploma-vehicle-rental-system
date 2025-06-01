package com.dmtryii.backend.controller;

import com.dmtryii.backend.dto.RoleDto;
import com.dmtryii.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.dmtryii.backend.payload.response.ResponseHandler.generateSuccessfulResponse;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<Object> getAll() {
        return generateSuccessfulResponse(
                roleService.getAll().stream()
                        .map(role -> modelMapper.map(role, RoleDto.class))
                        .toList(),
                HttpStatus.OK
        );
    }

}
