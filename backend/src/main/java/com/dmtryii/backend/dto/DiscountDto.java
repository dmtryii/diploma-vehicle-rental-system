package com.dmtryii.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DiscountDto extends DefaultAuditDto {

    @NotBlank(message = "Name must not be blank")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    private Double amount;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be in the present or future")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDateTime endDate;

    private List<UUID> userIds;

}
