package com.dmtryii.backend.service.impl;

import com.dmtryii.backend.dto.VehicleDto;
import com.dmtryii.backend.entity.AdditionalService;
import com.dmtryii.backend.entity.Rental;
import com.dmtryii.backend.entity.enums.ERentalStatus;
import com.dmtryii.backend.entity.enums.EVehicleStatus;
import com.dmtryii.backend.payload.request.RentalRequest;
import com.dmtryii.backend.repository.RentalRepository;
import com.dmtryii.backend.service.AdditionalServiceService;
import com.dmtryii.backend.service.DiscountService;
import com.dmtryii.backend.service.RentalCalculator;
import com.dmtryii.backend.service.RentalService;
import com.dmtryii.backend.service.UserService;
import com.dmtryii.backend.service.VehicleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RentalServiceImpl implements RentalService, RentalCalculator {

    private final RentalRepository rentalRepository;
    private final VehicleService vehicleService;
    private final AdditionalServiceService additionalServiceService;
    private final DiscountService discountService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Override
    public Rental get(UUID id) {
        return rentalRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Rental not found by id: " + id)
        );
    }

    @Override
    @Transactional
    public Rental create(RentalRequest request) {
        var user = userService.getCurrent();
        var vehicle = vehicleService.get(request.getVehicleId());
        vehicle.setStatus(EVehicleStatus.HIDDEN);
        vehicleService.update(vehicle.getId(), modelMapper.map(vehicle, VehicleDto.class));
        var additionalServices = additionalServiceService.getByIds(request.getAdditionalServicesIds());
        var rental = Rental.builder()
                .user(user)
                .status(ERentalStatus.AWAITING_CONFIRMATION)
                .vehicle(vehicle)
                .additionalServices(additionalServices)
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now())
                .endDate(request.getEndDate())
                .build();
        rental.setTotal(
                calculateTotalCost(rental, request.getDiscountId())
        );
        return rentalRepository.save(rental);
    }

    @Override
    public Rental update(UUID id, RentalRequest request) {
        var rental = get(id);
        rental.setStatus(
                request.getStatus()
        );
        rental.setVehicle(
                vehicleService.get(request.getVehicleId())
        );
        rental.setAdditionalServices(
                additionalServiceService.getByIds(request.getAdditionalServicesIds())
        );
        rental.setStartDate(
                request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now()
        );
        rental.setEndDate(
                request.getEndDate()
        );
        return rentalRepository.save(rental);
    }

    @Override
    @Transactional
    public Rental changeStatus(UUID id, ERentalStatus status) {
        var rental = get(id);
        if (status.equals(ERentalStatus.COMPLETED) || status.equals(ERentalStatus.REJECTED)) {
            var vehicle = rental.getVehicle();
            vehicle.setStatus(EVehicleStatus.AVAILABLE);
            vehicleService.update(vehicle.getId(), modelMapper.map(vehicle, VehicleDto.class));
        }
        rental.setStatus(status);
        return rentalRepository.save(rental);
    }

    @Override
    public List<Rental> getAllPersonal() {
        return userService.getCurrent().getRentals();
    }

    @Override
    public List<Rental> getAllByStatus(ERentalStatus status) {
        return rentalRepository.getAllByStatus(status);
    }

    @Override
    public List<Rental> getAll() {
        return rentalRepository.findAll();
    }

    @Override
    public double calculateTotalCost(Rental rental, UUID discountId) {
        var priceOfVehiclePerDay = rental.getVehicle().getPrice();

        double priceOfEntirePeriodOfTime = priceCalculationInTimeInterval(
                priceOfVehiclePerDay,
                rental.getStartDate(),
                rental.getEndDate()
        );

        var priceOfAllAdditionalServices = rental.getAdditionalServices()
                .stream()
                .mapToDouble(AdditionalService::getPrice)
                .sum();

        double totalPriceBeforeDiscounts = priceOfEntirePeriodOfTime + priceOfAllAdditionalServices;
        double discount = discountId != null
                ? totalPriceBeforeDiscounts * (discountService.get(discountId).getAmount() / 100)
                : 0;

        return totalPriceBeforeDiscounts - discount;
    }

    private double priceCalculationInTimeInterval(double priceOfVehiclePerDay,
                                                  LocalDateTime startDate,
                                                  LocalDateTime endDate) {
        long days = ChronoUnit.DAYS.between(startDate.toLocalDate(), endDate.toLocalDate());
        return days * priceOfVehiclePerDay;
    }
}
