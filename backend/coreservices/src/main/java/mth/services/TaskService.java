package mth.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mth.models.Task;
import mth.repository.TaskRepository;

@Service
public class TaskService {

	@Autowired
	TaskRepository TR;

	@Autowired
	JwtService JWT;

	public Object getTasks(String token) {
		Map<String, Object> response = new HashMap<>();
		try {
			JWT.validateJWT(token);
			response.put("code", 200);
			response.put("tasks", TR.findAll());
		}catch(Exception e) {
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	public Object getTask(String token, Long id) {
		Map<String, Object> response = new HashMap<>();
		try {
			JWT.validateJWT(token);
			response.put("code", 200);
			response.put("task", TR.findById(id).orElse(null));
		}catch(Exception e) {
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	public Object saveTask(String token, Task T) {
		Map<String, Object> response = new HashMap<>();
		try {
			JWT.validateJWT(token);
			if(T.getStatus() == null || T.getStatus().isBlank())
				T.setStatus("Pending");
			TR.save(T);
			response.put("code", 200);
			response.put("message", "Task saved.");
		}catch(Exception e) {
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	public Object deleteTask(String token, Long id) {
		Map<String, Object> response = new HashMap<>();
		try {
			JWT.validateJWT(token);
			TR.deleteById(id);
			response.put("code", 200);
			response.put("message", "Task deleted.");
		}catch(Exception e) {
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}
}
