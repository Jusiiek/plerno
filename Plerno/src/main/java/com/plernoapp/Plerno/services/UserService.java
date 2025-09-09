package com.plernoapp.Plerno.services;


import com.plernoapp.Plerno.dto.UserDetailsDto;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import com.plernoapp.Plerno.config.Config;

@Service
public class UserService {

    public final RestTemplate restTemplate;
    private final Config config;

    public UserService(
            RestTemplate restTemplate,
            Config config
    ) {
        this.restTemplate = restTemplate;
        this.config = config;
    }

    public UserDetailsDto getCurrentUser(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request  = new HttpEntity<>(headers);

        try {
            ResponseEntity<UserDetailsDto> response = restTemplate.exchange(
                    config.getUserServiceUrl() + "/users/me",
                    HttpMethod.GET,
                    request,
                    UserDetailsDto.class
            );
            return response.getBody();
        } catch (HttpClientErrorException e) {
            HttpStatus status = HttpStatus.valueOf(e.getStatusCode().value());
            if (status.equals(HttpStatus.UNAUTHORIZED)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
            }
            else if (status.equals(HttpStatus.FORBIDDEN)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
            }
            throw new ResponseStatusException(status, e.getResponseBodyAsString());
        }
    }
}

