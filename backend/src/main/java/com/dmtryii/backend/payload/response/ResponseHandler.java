package com.dmtryii.backend.payload.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;

public class ResponseHandler {

    public static ResponseEntity<Object> generateSuccessfulResponse(Object responseObj, HttpStatus status) {
        var map = new HashMap<String, Object>();
        map.put("success", true);
        map.put("data", responseObj);
        return new ResponseEntity<>(map, status);
    }

    public static ResponseEntity<Object> generateUnsuccessfulResponse(String message, HttpStatus status, Object error) {
        var map = new HashMap<String, Object>();
        map.put("success", false);
        map.put("message", message);
        map.put("error", error);
        return new ResponseEntity<>(map, status);
    }

}
