package com.plernoapp.Plerno.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document
public class Task {

    @Id
    private String id;
    private String title;
    private String description;
    private Status status;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;
    private LocalDateTime doneAt;

    public Task(String title, String description, Status status, String userId, LocalDateTime createdAt, LocalDateTime deadline, LocalDateTime doneAt) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.userId = userId;
        this.createdAt = createdAt;
        this.deadline = deadline;
        this.doneAt = doneAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public LocalDateTime getDoneAt() {
        return doneAt;
    }

    public void setDoneAt(LocalDateTime doneAt) {
        this.doneAt = doneAt;
    }
}
