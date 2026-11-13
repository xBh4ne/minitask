package com.example.minitask.service;

import com.example.minitask.model.Task;
import com.example.minitask.repository.TaskRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional
    public Task addTask(Task task) {
        task.setId(null);
        task.setCompleted(false);
        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Transactional
    public Optional<Task> updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setDescription(updatedTask.getDescription());
                    task.setCompleted(updatedTask.isCompleted());
                    return taskRepository.save(task);
                });
    }

    @Transactional
    public boolean deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            return false;
        }
        taskRepository.deleteById(id);
        return true;
    }

    @Transactional
    public Optional<Task> completeTask(Long id) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setCompleted(true);
                    return taskRepository.save(task);
                });
    }
}
