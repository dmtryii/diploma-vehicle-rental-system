package com.dmtryii.backend.entity;

import com.dmtryii.backend.entity.base.BaseEntityAudit;
import com.dmtryii.backend.entity.enums.ERentalStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rentals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Rental extends BaseEntityAudit {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ERentalStatus status;

    @Column(nullable = false)
    private LocalDateTime startDate = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    private double total;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
            name = "rentals_services",
            joinColumns = @JoinColumn(name = "rental_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<AdditionalService> additionalServices;

}
