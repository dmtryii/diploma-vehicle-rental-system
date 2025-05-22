package com.dmtryii.backend.dto;

import com.dmtryii.backend.entity.enums.EGender;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto extends DefaultAuditDto {

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private EGender gender;
    private LocalDate birthday;
    private List<RoleDto> roles;

}
