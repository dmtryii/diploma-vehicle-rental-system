package com.dmtryii.backend.service.impl;

import com.dmtryii.backend.dto.DiscountDto;
import com.dmtryii.backend.entity.Discount;
import com.dmtryii.backend.repository.DiscountRepository;
import com.dmtryii.backend.service.DiscountService;
import com.dmtryii.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;
    private final UserService userService;

    @Override
    public Discount get(UUID id) {
        return discountRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Discount not found by id: " + id)
        );
    }

    @Override
    public List<Discount> getPersonal() {
        return userService.getCurrent().getDiscounts();
    }

    @Override
    @Transactional
    public Discount create(DiscountDto dto) {
        var users = userService.getByIds(dto.getUserIds());
        var discount = Discount.builder()
                .name(dto.getName())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .amount(dto.getAmount())
                .build();
        var savedDiscount = discountRepository.save(discount);
        users.forEach(user -> {
            if (user.getDiscounts() == null) {
                user.setDiscounts(new ArrayList<>());
            }
            user.getDiscounts().add(savedDiscount);
        });
        userService.saveAll(users);
        return savedDiscount;
    }

    @Override
    public Discount update(UUID id, DiscountDto dto) {
        var discount = get(id);
        discount.setName(dto.getName());
        discount.setStartDate(dto.getStartDate());
        discount.setEndDate(dto.getEndDate());
        discount.setAmount(dto.getAmount());
        return discountRepository.save(discount);
    }

    @Override
    public List<Discount> getAll() {
        return discountRepository.findAll();
    }

    @Override
    public void delete(UUID id) {
        var discount = get(id);
        discountRepository.delete(discount);
    }
}
