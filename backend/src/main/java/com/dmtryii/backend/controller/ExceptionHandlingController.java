package com.dmtryii.backend.controller;

import com.dmtryii.backend.payload.response.ResponseHandler;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;

import static com.dmtryii.backend.payload.response.ResponseHandler.generateUnsuccessfulResponse;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class ExceptionHandlingController {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        var fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> "Field '" + error.getField() + "' " + error.getDefaultMessage())
                .toList();
        var globalErrors = ex.getBindingResult().getGlobalErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();
        var allErrors = new ArrayList<>();
        allErrors.addAll(fieldErrors);
        allErrors.addAll(globalErrors);
        log.warn(allErrors.toString(), ex);
        return ResponseHandler.generateUnsuccessfulResponse(
                allErrors.toString(),
                HttpStatus.BAD_REQUEST,
                HttpStatus.BAD_REQUEST.getReasonPhrase()
        );
    }

    @ExceptionHandler({
            EntityNotFoundException.class,
            IllegalArgumentException.class,
            HttpRequestMethodNotSupportedException.class
    })
    public ResponseEntity<Object> handleCommonBadRequestExceptions(Exception ex) {
        log.warn(ex.getMessage(), ex);
        return generateUnsuccessfulResponse(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST,
                HttpStatus.BAD_REQUEST.getReasonPhrase()
        );
    }

}
