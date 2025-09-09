package com.plernoapp.Plerno.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Flashcard {

    @Id
    private String id;
    private String question;
    private String answer;
    private String setId;

    public Flashcard(String question, String answer, String setId) {
        this.question = question;
        this.answer = answer;
        this.setId = setId;
    }

    public String getId() {
        return id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getSetId() {
        return setId;
    }

    public void setSetId(String setId) {
        this.setId = setId;
    }
}
