package com.dmtryii.backend.entity;

import com.dmtryii.backend.entity.base.BaseEntityAudit;
import com.dmtryii.backend.entity.enums.EBodyType;
import com.dmtryii.backend.entity.enums.EColor;
import com.dmtryii.backend.entity.enums.EDrivetrainType;
import com.dmtryii.backend.entity.enums.EVehicleStatus;
import com.dmtryii.backend.entity.enums.ETechnicalCondition;
import com.dmtryii.backend.entity.enums.ETransmissionType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "vehicles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Vehicle extends BaseEntityAudit {

    @Column(length = 50, nullable = false)
    private String name;

    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EVehicleStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EColor color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EBodyType bodyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EDrivetrainType drivetrainType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ETechnicalCondition technicalCondition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ETransmissionType transmissionType;

    @Column(nullable = false)
    private Integer years;

    @Column(nullable = false, unique = true)
    private String licensePlate;

    @Column(nullable = false, unique = true)
    private String vinCode;

    @Column(nullable = false)
    private Integer mileage;

    @Column(nullable = false)
    private Integer maxSpeed;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "manufacturer_id")
    private Manufacturer manufacturer;

    @ManyToOne
    @JoinColumn(name = "engine_id")
    private Engine engine;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehicleMediaFile> vehicleMediaFile;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rental> rentals;

}
