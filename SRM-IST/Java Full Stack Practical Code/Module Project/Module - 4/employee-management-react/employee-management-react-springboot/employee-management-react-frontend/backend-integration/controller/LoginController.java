package com.example.employee.controller;

import com.example.employee.security.JwtService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST login endpoints used by the React front end.
 * Replace the existing LoginController with this controller.
 * Demo credentials intentionally match the original teaching project.
 */
@RestController
@RequestMapping("/api/auth")
public class LoginController {
    private final JwtService jwtService;

    public LoginController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public record LoginRequest(String username, String password) {}
    public record LoginResponse(String username, String role, String token) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        if (request.username() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required."));
        }

        String username = request.username().trim().toLowerCase();
        String role = null;
        if (username.equals("hr") && request.password().equals("1234")) role = "HR";
        else if (username.equals("manager") && request.password().equals("1234")) role = "MANAGER";
        else if (username.equals("employee") && request.password().equals("1234")) role = "EMPLOYEE";

        if (role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password."));
        }

        String token = jwtService.generateToken(username, role);
        session.setAttribute("jwtToken", token);
        session.setAttribute("username", username);
        session.setAttribute("role", role);
        return ResponseEntity.ok(new LoginResponse(username, role, token));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object username = session.getAttribute("username");
        Object role = session.getAttribute("role");
        if (username == null || role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in."));
        }
        return ResponseEntity.ok(Map.of("username", username, "role", role));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }
}
