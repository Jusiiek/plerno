package com.plernoapp.Plerno.services;

import com.plernoapp.Plerno.models.Status;
import com.plernoapp.Plerno.models.Task;
import com.plernoapp.Plerno.dto.CreateTaskDto;
import com.plernoapp.Plerno.dto.UpdateTaskDto;
import com.plernoapp.Plerno.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.plernoapp.Plerno.models.Status;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(CreateTaskDto dto) {
        Task task = new Task(
                dto.getTitle(),
                dto.getDescription(),
                Status.TODO,
                dto.getUserId(),
                LocalDateTime.now(),
                dto.getDeadline(),
                null
        );
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    public Task updateTask(String id, UpdateTaskDto dto) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(dto.getTitle());
            task.setDescription(dto.getDescription());
            task.setStatus(dto.getStatus());
            task.setDeadline(dto.getDeadline());
            task.setDoneAt(dto.getStatus() == Status.DONE ? LocalDateTime.now() : null);
            return taskRepository.save(task);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getTasksByUserId(String userId) {
        return taskRepository.findAllByUserId(userId);
    }
}
