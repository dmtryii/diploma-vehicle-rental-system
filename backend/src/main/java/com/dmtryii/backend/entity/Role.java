package com.dmtryii.backend.entity;

import com.dmtryii.backend.entity.base.BaseEntityAudit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Role extends BaseEntityAudit {

    @Column(length = 80, unique = true)
    private String name;

    @ManyToMany(mappedBy = "roles")
    private List<User> users;

}
