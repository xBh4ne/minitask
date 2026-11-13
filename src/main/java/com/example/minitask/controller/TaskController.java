package com.example.minitask.controller;

import com.example.minitask.model.Task;
import com.example.minitask.service.TaskService;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TaskController {

	private final TaskService taskService;

	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}

	@GetMapping("/api/tasks")
	public List<Task> getAllTasks() {
		return taskService.getAllTasks();
	}

	@PostMapping("/api/tasks")
	@ResponseStatus(HttpStatus.CREATED)
	public Task createTask(@RequestBody Task task) {
		return taskService.addTask(task);
	}

	@GetMapping("/api/tasks/{id}")
	public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
		Optional<Task> task = taskService.getTaskById(id);

		if (task.isPresent()) {
			return ResponseEntity.ok(task.get());
		}

		return ResponseEntity.notFound().build();
	}

	@PutMapping("/api/tasks/{id}")
	public ResponseEntity<Task> updateTask(
		@PathVariable Long id,
		@RequestBody Task task
	) {
		Optional<Task> updated = taskService.updateTask(id, task);

		if (updated.isPresent()) {
			return ResponseEntity.ok(updated.get());
		}

		return ResponseEntity.notFound().build();
	}

	@DeleteMapping("/api/tasks/{id}")
	public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
		boolean deleted = taskService.deleteTask(id);

		if (deleted) {
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.notFound().build();
	}

	@PatchMapping("/api/tasks/{id}/complete")
	public ResponseEntity<Task> completeTask(@PathVariable Long id) {
		Optional<Task> completed = taskService.completeTask(id);

		if (completed.isPresent()) {
			return ResponseEntity.ok(completed.get());
		}

		return ResponseEntity.notFound().build();
	}
}
