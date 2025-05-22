package com.dmtryii.backend.entity;

import com.dmtryii.backend.entity.base.BaseEntityAudit;
import com.dmtryii.backend.entity.enums.EGender;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntityAudit {

    @Column(length = 50, nullable = false, unique = true)
    private String username;

    @Column(length = 50, nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 25, nullable = false)
    private String firstName;

    @Column(length = 25, nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EGender gender;

    @Column(nullable = false)
    private LocalDate birthday;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles;

    @OneToMany(mappedBy = "user")
    private List<Rental> rentals;

    @ManyToMany
    @JoinTable(
            name = "users_discounts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "discount_id")
    )
    private List<Discount> discounts;

}
