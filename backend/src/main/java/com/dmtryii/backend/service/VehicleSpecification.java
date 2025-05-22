package com.dmtryii.backend.service;

import com.dmtryii.backend.entity.Vehicle;
import com.dmtryii.backend.entity.enums.EBodyType;
import com.dmtryii.backend.entity.enums.EColor;
import com.dmtryii.backend.entity.enums.EVehicleStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class VehicleSpecification {

    public static Specification<Vehicle> hasNameLike(String name) {
        return (root, query, cb) ->
                name == null ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Vehicle> hasStatus(EVehicleStatus status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Vehicle> hasColor(EColor color) {
        return (root, query, cb) ->
                color == null ? null : cb.equal(root.get("color"), color);
    }

    public static Specification<Vehicle> hasBodyType(EBodyType bodyType) {
        return (root, query, cb) ->
                bodyType == null ? null : cb.equal(root.get("bodyType"), bodyType);
    }

    public static Specification<Vehicle> hasPriceBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min != null && max != null) return cb.between(root.get("price"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            if (max != null) return cb.lessThanOrEqualTo(root.get("price"), max);
            return null;
        };
    }

    public static Specification<Vehicle> hasYearBetween(Integer min, Integer max) {
        return (root, query, cb) -> {
            if (min != null && max != null) return cb.between(root.get("years"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("years"), min);
            if (max != null) return cb.lessThanOrEqualTo(root.get("years"), max);
            return null;
        };
    }

    public static Specification<Vehicle> hasManufacturerId(UUID id) {
        return (root, query, cb) ->
                id == null ? null : cb.equal(root.get("manufacturer").get("id"), id);
    }

    public static Specification<Vehicle> hasEngineId(UUID id) {
        return (root, query, cb) ->
                id == null ? null : cb.equal(root.get("engine").get("id"), id);
    }

}
