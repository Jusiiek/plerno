package com.plernoapp.Plerno.repositories;

import com.plernoapp.Plerno.models.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findAllByUserId(String userId);
}
