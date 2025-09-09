package com.plernoapp.Plerno.controllers;


import com.plernoapp.Plerno.annotation.CurrentUser;
import com.plernoapp.Plerno.dto.CreateFlashcardSetDto;
import com.plernoapp.Plerno.dto.UpdateFlashcardSetDto;
import com.plernoapp.Plerno.dto.UserDetailsDto;
import com.plernoapp.Plerno.models.Flashcard;
import com.plernoapp.Plerno.models.FlashcardSet;
import com.plernoapp.Plerno.services.FlashcardService;
import com.plernoapp.Plerno.services.FlashcardSetService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.plernoapp.Plerno.models.Category;

import java.util.List;

@RestController
@RequestMapping("/flashcard_set")
public class FlashcardSetController {

    private FlashcardSetService flashcardSetService;
    private FlashcardService flashcardService;

    public FlashcardSetController (
            FlashcardSetService flashcardSetService,
            FlashcardService flashcardService
    ) {
        this.flashcardSetService = flashcardSetService;
        this.flashcardService = flashcardService;
    }

    @PostMapping("/")
    public FlashcardSet createFlashcardSet(
            @RequestBody CreateFlashcardSetDto dto,
            @CurrentUser UserDetailsDto user
    ) {
        dto.setUserId(user.getId());
        return flashcardSetService.createFlashcardSet(dto);
    }

    @GetMapping("/user")
    public List<FlashcardSet> getUserSets(@CurrentUser UserDetailsDto user) {
        System.out.println(user.getId());
        return flashcardSetService.getAllUserFlashcardSets(user.getId());
    }

    @GetMapping("/category")
    public List<Category> getCategories(@CurrentUser UserDetailsDto user) {
        return List.of(Category.values());
    }

    @GetMapping("/{setId}")
    public FlashcardSet getSetDetails(
            @PathVariable String setId,
            @CurrentUser UserDetailsDto user
    ) {
        return flashcardSetService.getFlashcardSetById(setId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{setId}")
    public FlashcardSet updateFlashcardSet(
            @PathVariable String setId,
            @RequestBody UpdateFlashcardSetDto dto,
            @CurrentUser UserDetailsDto user
            ) {
        return flashcardSetService.updateFlashcardSet(setId, dto);
    }

    @DeleteMapping("/{setId}")
    public void deleteFlashcardSet(
            @PathVariable String setId,
            @CurrentUser UserDetailsDto user
    ) {
        FlashcardSet flashcardSet = flashcardSetService.getFlashcardSetById(setId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        flashcardService.deleteBySetId(setId);
        flashcardSetService.deleteFlashcardSet(flashcardSet);
    }
}
