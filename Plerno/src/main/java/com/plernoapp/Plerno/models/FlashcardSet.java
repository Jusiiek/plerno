package com.plernoapp.Plerno.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class FlashcardSet {

    @Id
    private String id;
    private String title;
    private String description;
    private String userId;
    private Category category;

    public FlashcardSet(String title, String description, String userId, Category category) {
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.category = category;
    }

    public String getId() {
        return id;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}

