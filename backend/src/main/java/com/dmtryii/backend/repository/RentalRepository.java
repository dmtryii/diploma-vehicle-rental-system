package com.dmtryii.backend.repository;

import com.dmtryii.backend.entity.Rental;
import com.dmtryii.backend.entity.enums.ERentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RentalRepository extends JpaRepository<Rental, UUID> {
    List<Rental> getAllByStatus(ERentalStatus status);
}
