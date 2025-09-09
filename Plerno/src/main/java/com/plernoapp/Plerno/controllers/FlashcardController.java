package com.plernoapp.Plerno.controllers;

import com.plernoapp.Plerno.annotation.CurrentUser;
import com.plernoapp.Plerno.dto.CreateFlashcardDto;
import com.plernoapp.Plerno.dto.UpdateFlashcardDto;
import com.plernoapp.Plerno.dto.UserDetailsDto;
import com.plernoapp.Plerno.models.Flashcard;
import com.plernoapp.Plerno.services.FlashcardService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/flashcard")
public class FlashcardController {

    private FlashcardService flashcardService;

    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    @PostMapping("/{setId}")
    Flashcard createFlashcard(
            @PathVariable String setId,
            @RequestBody CreateFlashcardDto dto,
            @CurrentUser UserDetailsDto user
            ) {
        dto.setSetId(setId);
        return flashcardService.createFlashcard(dto);
    }

    @GetMapping("/{setId}")
    List<Flashcard> getSetsCard(
            @PathVariable String setId,
            @CurrentUser UserDetailsDto user
    ) {
        return flashcardService.getSetFlashcards(setId);
    }

    @PutMapping("/{cardId}")
    public Flashcard updateFlashcard(
            @PathVariable String cardId,
            @RequestBody UpdateFlashcardDto dto,
            @CurrentUser UserDetailsDto user
    ) {
        return flashcardService.updateFlashcard(
                cardId,
                dto
        );
    }

    @DeleteMapping("/{cardId}")
    public void deleteFlashcard(
            @PathVariable String cardId,
            @CurrentUser UserDetailsDto user
    ) {
        Flashcard flashcard = flashcardService.getFlashcardById(
                cardId
        ).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        flashcardService.deleteFlashcard(flashcard);
    }
}
