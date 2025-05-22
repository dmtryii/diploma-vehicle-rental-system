package com.dmtryii.backend.entity;

import com.dmtryii.backend.entity.base.BaseEntityAudit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "additional_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AdditionalService extends BaseEntityAudit {

    private String name;

    private Double price;

    @Column(columnDefinition = "TEXT")
    private String description;

}
