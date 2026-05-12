package mth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mth.models.Task;
import mth.services.TaskService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/taskservice")
public class TaskController {

	@Autowired
	TaskService TS;

	@GetMapping("/tasks")
	public Object getTasks(@RequestHeader("Token") String token) {
		return TS.getTasks(token);
	}

	@GetMapping("/tasks/{id}")
	public Object getTask(@RequestHeader("Token") String token, @PathVariable Long id) {
		return TS.getTask(token, id);
	}

	@PostMapping("/tasks")
	public Object saveTask(@RequestHeader("Token") String token, @RequestBody Task T) {
		return TS.saveTask(token, T);
	}

	@PutMapping("/tasks")
	public Object updateTask(@RequestHeader("Token") String token, @RequestBody Task T) {
		return TS.saveTask(token, T);
	}

	@DeleteMapping("/tasks/{id}")
	public Object deleteTask(@RequestHeader("Token") String token, @PathVariable Long id) {
		return TS.deleteTask(token, id);
	}
}
