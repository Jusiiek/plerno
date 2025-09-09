package com.plernoapp.Plerno.services;


import com.plernoapp.Plerno.dto.CreateFlashcardDto;
import com.plernoapp.Plerno.dto.UpdateFlashcardDto;
import com.plernoapp.Plerno.models.Flashcard;
import com.plernoapp.Plerno.repositories.FlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    public Flashcard createFlashcard(CreateFlashcardDto dto) {
        Flashcard flashcard = new Flashcard(
                dto.getQuestion(),
                dto.getAnswer(),
                dto.getSetId()
        );
        return flashcardRepository.save(flashcard);
    }

    public List<Flashcard> getSetFlashcards(String setId) {
        return flashcardRepository.findAllBySetId(setId);
    }

    public Optional<Flashcard> getFlashcardById(String id) {
        return flashcardRepository.findById(id);
    }

    public Flashcard updateFlashcard(String id, UpdateFlashcardDto dto) {
        return flashcardRepository.findById(id).map(fc -> {
            fc.setAnswer(dto.getAnswer());
            fc.setQuestion(dto.getQuestion());
            return flashcardRepository.save(fc);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public void deleteBySetId(String setId) {
        flashcardRepository.deleteBySetId(setId);
    }

    public void deleteFlashcard(Flashcard flashcard) {
        flashcardRepository.delete(flashcard);
    }
}
