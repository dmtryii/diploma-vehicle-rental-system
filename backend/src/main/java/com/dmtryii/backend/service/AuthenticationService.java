package com.dmtryii.backend.service;

import com.dmtryii.backend.payload.request.AuthenticationRequest;
import com.dmtryii.backend.payload.request.RegisterRequest;
import com.dmtryii.backend.payload.response.AuthenticationResponse;

public interface AuthenticationService {
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse authenticate(AuthenticationRequest request);
}
