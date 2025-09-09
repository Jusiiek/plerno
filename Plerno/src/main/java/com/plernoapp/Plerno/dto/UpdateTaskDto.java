package com.plernoapp.Plerno.dto;

import com.plernoapp.Plerno.models.Status;

import java.time.LocalDateTime;

public class UpdateTaskDto {
    private String title;
    private String description;
    private Status status;
    private LocalDateTime deadline;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Status getStatus() {
        return status;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }
}
