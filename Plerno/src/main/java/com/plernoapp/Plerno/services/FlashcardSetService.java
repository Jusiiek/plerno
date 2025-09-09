package com.plernoapp.Plerno.services;


import com.plernoapp.Plerno.dto.CreateFlashcardSetDto;
import com.plernoapp.Plerno.dto.UpdateFlashcardSetDto;
import com.plernoapp.Plerno.models.FlashcardSet;
import com.plernoapp.Plerno.repositories.FlashcardSetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class FlashcardSetService {

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    public FlashcardSet createFlashcardSet(CreateFlashcardSetDto dto) {
        FlashcardSet flashcardSet = new FlashcardSet(
                dto.getTitle(),
                dto.getDescription(),
                dto.getUserId(),
                dto.getCategory()
        );
        return flashcardSetRepository.save(flashcardSet);
    }

    public List<FlashcardSet> getAllUserFlashcardSets(String userId) {
        return flashcardSetRepository.findAllByUserId(userId);
    }

    public Optional<FlashcardSet> getFlashcardSetById(String setId) {
        return flashcardSetRepository.findById(setId);
    }

    public FlashcardSet updateFlashcardSet(String id, UpdateFlashcardSetDto dto) {
        return flashcardSetRepository.findById(id).map(fcs -> {
            fcs.setTitle(dto.getTitle());
            fcs.setDescription(dto.getDescription());
            fcs.setCategory(dto.getCategory());
            return flashcardSetRepository.save(fcs);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public void deleteFlashcardSet(FlashcardSet flashcardSet) {
        flashcardSetRepository.delete(flashcardSet);
    }
}
