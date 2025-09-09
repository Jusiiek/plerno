package com.plernoapp.Plerno.repositories;

import com.plernoapp.Plerno.models.Flashcard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends MongoRepository<Flashcard, String> {
    List<Flashcard> findAllBySetId(String setId);
    void deleteBySetId(String setId);
}
