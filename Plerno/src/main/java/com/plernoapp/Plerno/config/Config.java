package com.plernoapp.Plerno.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Config {

    @Value("${USER_SERVICE_URL:http://localhost:8000}")
    private String userServiceUrl;

    public String getUserServiceUrl() {
        return userServiceUrl;
    }

}
