package com.plernoapp.Plerno.dto;

import com.plernoapp.Plerno.models.Category;

public class CreateFlashcardSetDto {

    private String title;
    private String description;
    private Category category;
    private String userId;

    public CreateFlashcardSetDto(String title, String description, Category category) {
        this.title = title;
        this.description = description;
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Category getCategory() {
        return category;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }
}
