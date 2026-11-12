package com.example.employee.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** REST dashboard information endpoint; the React dashboard is served at /dashboard. */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @GetMapping
    public ResponseEntity<?> dashboard(HttpSession session) {
        Object username = session.getAttribute("username");
        Object role = session.getAttribute("role");
        if (username == null || role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in."));
        }
        return ResponseEntity.ok(Map.of("username", username, "role", role));
    }
}
