package com.dmtryii.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.flywaydb.core.Flyway;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FlywayExecutor {

    private final Flyway flyway;

    @PostConstruct
    public void migrate() {
        flyway.migrate();
    }
}
