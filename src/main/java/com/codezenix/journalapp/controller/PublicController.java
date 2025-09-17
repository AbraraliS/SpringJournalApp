package com.codezenix.journalapp.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthChekController {
    @GetMapping("/health-check")
    public String healthCheck() {
        return "OK";
    }
}
