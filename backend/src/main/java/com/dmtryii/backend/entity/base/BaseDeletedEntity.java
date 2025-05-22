package com.dmtryii.backend.entity.base;

import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = true)
public abstract class BaseDeletedEntity extends BaseEntity {

    private boolean deleted = false;

}
