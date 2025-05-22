package com.dmtryii.backend.payload.response;

import lombok.Data;

@Data
public class RentalTotalCostResponse {

    private RentalResponse rental;
    private Double totalCost;

}
