package com.dmtryii.backend.entity;

import com.dmtryii.backend.entity.base.BaseEntityAudit;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicle_media_files")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class VehicleMediaFile extends BaseEntityAudit {

    private String name;
    private String contentType;

    @Lob
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

}
