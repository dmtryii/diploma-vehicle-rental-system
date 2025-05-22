package com.dmtryii.backend.controller;

import com.dmtryii.backend.dto.UserDto;
import com.dmtryii.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.dmtryii.backend.payload.response.ResponseHandler.generateSuccessfulResponse;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<Object> getAll() {
        return generateSuccessfulResponse(
                userService.getAll().stream()
                        .map(user -> modelMapper.map(user, UserDto.class))
                        .toList(),
                HttpStatus.OK
        );
    }

}
