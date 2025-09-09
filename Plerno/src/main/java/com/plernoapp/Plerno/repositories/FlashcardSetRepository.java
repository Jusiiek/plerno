package com.plernoapp.Plerno.repositories;

import com.plernoapp.Plerno.models.FlashcardSet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardSetRepository extends MongoRepository<FlashcardSet, String> {
    List<FlashcardSet> findAllByUserId(String userId);
}
