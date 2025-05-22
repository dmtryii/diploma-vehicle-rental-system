package com.dmtryii.backend.repository;

import com.dmtryii.backend.entity.Engine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EngineRepository extends JpaRepository<Engine, UUID> {
}
