package mth.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import mth.models.Menus;
import mth.models.Roles;
import mth.models.Users;
import mth.repository.UsersRepository;

@Service
public class UsersService {
	
	@Autowired
	UsersRepository UR;
	
	@Autowired
	JwtService JWT;

	@Autowired
	EntityManager EM;
		
	public Object signup(Users U)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			Object id = UR.checkByEmail(U.getEmail());
			if(id != null)
			{				
				response.put("code", 501);
				response.put("message", "Email ID already registered");
			}
			else
			{
				if(U.getRole() <= 0)
					U.setRole(1);	//Set default role only when no role is selected
				U.setStatus(1);		//Make the status of the user as active
				
				UR.save(U);			//Insert into the database table (users)
				
				response.put("code", 200);
				response.put("message", "User account has been created.");
			}
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}
	
	public Object signin(Map<String, Object> data)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			int selectedRole = Integer.parseInt(data.get("role").toString());
			String username = data.get("username").toString().trim();
			String password = data.get("password").toString();
			Object role = UR.validateCredentials(username, password); 	//Validate user name and password
			if(role == null)
			{
				response.put("code", 404);
				response.put("message", "Invalid email or password!");
			}
			else if(Integer.parseInt(role.toString()) != selectedRole)
			{
				response.put("code", 404);
				response.put("message", "Selected role does not match this user account.");
			}
			else
			{
				response.put("code", 200);
				response.put("jwt", JWT.generateJWT(username, role)); //Generate JWT token and return as response
			}
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}
	
	public Object uinfo(String token)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			Map<String, Object> payload = JWT.validateJWT(token);
	        String email = (String) payload.get("username");
	        Users U = (Users) UR.findByEmail(email);
	        
	        List<Object> menuList = UR.getMenus(Long.valueOf(U.getRole()));
			
	        response.put("code", 200);
	        response.put("fullname", U.getFullname());
	        response.put("menulist", menuList);
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	public Object users(String token)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			JWT.validateJWT(token);
			response.put("code", 200);
			response.put("users", UR.findAll());
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	public Object roles()
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			response.put("code", 200);
			response.put("roles", EM.createQuery("select R from Roles R order by R.role", Roles.class).getResultList());
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	@Transactional
	public Object addRole(String token, Roles R)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			JWT.validateJWT(token);
			EM.merge(R);
			response.put("code", 200);
			response.put("message", "Role saved.");
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	public Object menus(String token)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			JWT.validateJWT(token);
			response.put("code", 200);
			response.put("menus", EM.createQuery("select M from Menus M order by M.mid", Menus.class).getResultList());
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	@Transactional
	public Object addMenu(String token, Menus M)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			JWT.validateJWT(token);
			if(M.getIcon() == null || M.getIcon().isBlank())
				M.setIcon("dashboard.png");
			EM.merge(M);
			response.put("code", 200);
			response.put("message", "Menu saved.");
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	@Transactional
	public Object saveRoleMapping(String token, Map<String, Object> data)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			JWT.validateJWT(token);
			Number role = (Number) data.get("role");
			List<?> mids = (List<?>) data.get("mids");

			EM.createNativeQuery("delete from rolesmapping where role = :role")
				.setParameter("role", role.longValue())
				.executeUpdate();

			for(Object mid : mids)
			{
				Number menuId = (Number) mid;
				EM.createNativeQuery("insert into rolesmapping (role, mid) values (:role, :mid)")
					.setParameter("role", role.longValue())
					.setParameter("mid", menuId.longValue())
					.executeUpdate();
			}

			response.put("code", 200);
			response.put("message", "Role mapping saved.");
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}
}
