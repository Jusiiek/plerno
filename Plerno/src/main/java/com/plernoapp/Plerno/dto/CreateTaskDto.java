package com.plernoapp.Plerno.dto;

import java.time.LocalDateTime;

public class CreateTaskDto {
    private String title;
    private String description;
    private String userId = "";
    private LocalDateTime deadline;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }
}
