package com.dmtryii.backend.payload.request;

import com.dmtryii.backend.entity.enums.EGender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private EGender gender;
    private LocalDate birthday;
    private String password;
}
