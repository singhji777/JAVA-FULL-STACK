package com.example.employee.controller;

import com.example.employee.model.Department;
import com.example.employee.service.DepartmentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** REST API replacement for the original view-returning DepartmentController. */
@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    public record DepartmentRequest(String name) {}

    @GetMapping
    public ResponseEntity<?> list(HttpSession session) {
        if (!hasRole(session, "HR", "MANAGER", "EMPLOYEE")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Please log in."));
        }
        return ResponseEntity.ok(departmentService.getAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody DepartmentRequest request, HttpSession session) {
        if (!hasRole(session, "HR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Only HR can add departments."));
        }
        if (request == null || request.name() == null || request.name().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Department name is required."));
        }
        boolean exists = departmentService.getAll().stream()
                .anyMatch(d -> d.getName().equalsIgnoreCase(request.name().trim()));
        if (exists) {
            return ResponseEntity.badRequest().body(Map.of("message", "A department with this name already exists."));
        }
        Department created = departmentService.create(new Department(null, request.name().trim()));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    private boolean hasRole(HttpSession session, String... allowed) {
        Object role = session.getAttribute("role");
        if (role == null) return false;
        for (String item : allowed) if (item.equals(role)) return true;
        return false;
    }
}
