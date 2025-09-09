package com.plernoapp.Plerno.controllers;

import com.plernoapp.Plerno.annotation.CurrentUser;
import com.plernoapp.Plerno.dto.CreateTaskDto;
import com.plernoapp.Plerno.dto.UpdateTaskDto;
import com.plernoapp.Plerno.dto.UserDetailsDto;
import org.springframework.web.bind.annotation.*;

import com.plernoapp.Plerno.models.Task;
import com.plernoapp.Plerno.services.TaskService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/")
    public List<Task> getAllTasks(@CurrentUser UserDetailsDto user) {
        return taskService.getAllTasks();
    }

    @PostMapping("/")
    public Task addTask(@RequestBody CreateTaskDto dto, @CurrentUser UserDetailsDto user) {
        dto.setUserId(user.getId());
        return taskService.createTask(dto);
    }

    @GetMapping("/{taskId}")
    public Optional<Task> getTaskDetails(
            @PathVariable String taskId,
            @CurrentUser UserDetailsDto user
    ) {
        return taskService.getTaskById(taskId);
    }

    @PutMapping("/{taskId}")
    public Task updateTask(
            @PathVariable String taskId,
            @RequestBody UpdateTaskDto dto,
            @CurrentUser UserDetailsDto user
    ) {
        return taskService.updateTask(taskId, dto);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(
            @PathVariable String taskId,
            @CurrentUser UserDetailsDto user
    ) {
        taskService.deleteTask(taskId);
    }

    @GetMapping("/userTasks")
    public List<Task> getTasksByUser(@CurrentUser UserDetailsDto user) {
        return taskService.getTasksByUserId(user.getId());
    }

}
