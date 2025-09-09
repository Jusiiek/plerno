package com.plernoapp.Plerno.dto;

import com.plernoapp.Plerno.models.Category;

public class UpdateFlashcardSetDto {
    private String title;
    private String description;
    private Category category;

    public UpdateFlashcardSetDto(String title, String description, Category category) {
        this.title = title;
        this.description = description;
        this.category = category;
    }

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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
