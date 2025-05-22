package com.dmtryii.backend.controller;

import com.dmtryii.backend.payload.request.AuthenticationRequest;
import com.dmtryii.backend.payload.request.RegisterRequest;
import com.dmtryii.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.dmtryii.backend.payload.response.ResponseHandler.generateSuccessfulResponse;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        return generateSuccessfulResponse(
                authenticationService.register(request),
                HttpStatus.OK
        );
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Object> authentication(@RequestBody AuthenticationRequest request) {
        return generateSuccessfulResponse(
                authenticationService.authenticate(request),
                HttpStatus.OK
        );
    }

}
