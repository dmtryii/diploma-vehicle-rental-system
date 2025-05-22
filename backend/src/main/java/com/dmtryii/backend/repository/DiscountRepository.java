package com.dmtryii.backend.repository;

import com.dmtryii.backend.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, UUID> {
}
