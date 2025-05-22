package com.dmtryii.backend.entity;

import com.dmtryii.backend.entity.base.BaseEntityAudit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "manufacturers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Manufacturer extends BaseEntityAudit {

    @Column(length = 50, unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String country;

    @OneToMany(mappedBy = "manufacturer")
    private List<Vehicle> vehicles;

}
