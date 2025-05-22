package com.dmtryii.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.UUID;

import static com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING;

@Data
@EqualsAndHashCode(callSuper = true)
public class DefaultAuditDto extends BaseDto {

    @JsonFormat(shape = STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    private UUID createdBy;

}
