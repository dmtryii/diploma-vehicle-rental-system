package com.dmtryii.backend.dto;

import com.dmtryii.backend.entity.enums.ERentalStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RentalDto extends DefaultAuditDto {

    @NotNull(message = "Status is required")
    private ERentalStatus status;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be in the present or future")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDateTime endDate;

    private double total;

    @NotNull(message = "Vehicle ID is required")
    private VehicleDto vehicle;

    private List<AdditionalServiceDto> additionalServices;

}
