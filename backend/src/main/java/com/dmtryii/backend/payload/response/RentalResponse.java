package com.dmtryii.backend.payload.response;

import com.dmtryii.backend.dto.AdditionalServiceDto;
import com.dmtryii.backend.dto.VehicleDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RentalResponse {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private VehicleDto vehicle;
    private double total;
    private List<AdditionalServiceDto> additionalServices;
}
