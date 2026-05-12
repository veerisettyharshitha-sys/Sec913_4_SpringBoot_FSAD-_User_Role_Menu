package mth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mth.models.Menus;
import mth.models.Roles;
import mth.models.Users;
import mth.services.UsersService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/authservice")
public class UsersController {

	@Autowired
	UsersService US;
	
	@CrossOrigin(origins = "*")
	
	@PostMapping("/signup")
	public Object signup(@RequestBody Users U)
	{
		return US.signup(U);
	}
	
	@PostMapping("/signin")
	public Object signin(@RequestBody Map<String, Object> data)
	{
		return US.signin(data);
	}
	
	@GetMapping("/uinfo")
	public Object uinfo(@RequestHeader("Token") String token)
	{
		return US.uinfo(token);
	}

	@GetMapping("/users")
	public Object users(@RequestHeader("Token") String token)
	{
		return US.users(token);
	}

	@GetMapping("/roles")
	public Object roles()
	{
		return US.roles();
	}
	
	@PostMapping("/roles")
	public Object addRole(@RequestHeader("Token") String token, @RequestBody Roles R)
	{
		return US.addRole(token, R);
	}
	
	@GetMapping("/menus")
	public Object menus(@RequestHeader("Token") String token)
	{
		return US.menus(token);
	}
	
	@PostMapping("/menus")
	public Object addMenu(@RequestHeader("Token") String token, @RequestBody Menus M)
	{
		return US.addMenu(token, M);
	}
	
	@PostMapping("/rolesmapping")
	public Object saveRoleMapping(@RequestHeader("Token") String token, @RequestBody Map<String, Object> data)
	{
		return US.saveRoleMapping(token, data);
	}
	
	
	@GetMapping("/test")
	public String testMethod()
	{
		return "Welcome I'm fine";
	}
}
