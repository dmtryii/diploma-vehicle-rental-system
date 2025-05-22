package com.dmtryii.backend.repository;

import com.dmtryii.backend.entity.Vehicle;
import com.dmtryii.backend.entity.VehicleMediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VehicleMediaFileRepository extends JpaRepository<VehicleMediaFile, UUID> {
    List<VehicleMediaFile> findAllByVehicle(Vehicle vehicle);
}
