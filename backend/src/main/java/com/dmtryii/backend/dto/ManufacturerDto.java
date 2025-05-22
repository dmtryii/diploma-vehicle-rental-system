package com.dmtryii.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ManufacturerDto extends DefaultAuditDto {
    @NotBlank(message = "Manufacturer name must not be blank")
    @Size(max = 100, message = "Manufacturer name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Country must not be blank")
    @Size(max = 100, message = "Country name must not exceed 100 characters")
    private String country;
}
