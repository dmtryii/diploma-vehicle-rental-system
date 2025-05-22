package com.dmtryii.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdditionalServiceDto extends DefaultAuditDto {

    @NotBlank(message = "Name must not be blank")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private Double price;
    private String description;

}
