package com.example.employee.controller;

import com.example.employee.model.Department;
import com.example.employee.model.Employee;
import com.example.employee.service.DepartmentService;
import com.example.employee.service.EmployeeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST API replacement for the original view-returning EmployeeController.
 * Keeps the existing EmployeeService and DepartmentService.
 */
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final DepartmentService departmentService;

    public EmployeeController(EmployeeService employeeService, DepartmentService departmentService) {
        this.employeeService = employeeService;
        this.departmentService = departmentService;
    }

    public record EmployeeRequest(String name, String email, double salary, Long departmentId) {}
    public record EmployeePage(List<Employee> content, int page, int size, int totalPages, long totalElements) {}

    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            HttpSession session) {
        if (!hasRole(session, "HR", "MANAGER", "EMPLOYEE")) return unauthorized();
        if (page < 0 || size < 1 || size > 1000) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid page or size."));
        }
        List<Employee> all = employeeService.getEmployees(0, Math.max(1, getTotalEmployeesEstimate()), sortBy, direction);
        int start = page * size;
        List<Employee> content = start >= all.size()
                ? List.of()
                : all.subList(start, Math.min(start + size, all.size()));
        int totalPages = Math.max(1, (int) Math.ceil((double) all.size() / size));
        return ResponseEntity.ok(new EmployeePage(content, page, size, totalPages, all.size()));
    }

    // Existing service intentionally exposes pagination but not a count; for this in-memory project,
    // fetch a generous first page for sorting, then return the requested slice.
    private int getTotalEmployeesEstimate() { return 1000; }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id, HttpSession session) {
        if (!hasRole(session, "HR", "MANAGER", "EMPLOYEE")) return unauthorized();
        Employee employee = employeeService.getById(id);
        return employee == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(employee);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody EmployeeRequest request, HttpSession session) {
        if (!hasRole(session, "HR")) return forbidden();
        ResponseEntity<?> validation = validate(request);
        if (validation != null) return validation;
        Department department = departmentService.getById(request.departmentId());
        Employee employee = new Employee(null, request.name().trim(), request.email().trim(),
                request.salary(), department);
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.create(employee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody EmployeeRequest request, HttpSession session) {
        if (!hasRole(session, "HR", "MANAGER")) return forbidden();
        ResponseEntity<?> validation = validate(request);
        if (validation != null) return validation;
        if (employeeService.getById(id) == null) return ResponseEntity.notFound().build();
        Department department = departmentService.getById(request.departmentId());
        Employee updated = new Employee(id, request.name().trim(), request.email().trim(),
                request.salary(), department);
        Employee result = employeeService.update(id, updated);
        return result == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, HttpSession session) {
        if (!hasRole(session, "HR")) return forbidden();
        if (!employeeService.delete(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<?> validate(EmployeeRequest request) {
        if (request == null || request.name() == null || request.name().isBlank()
                || request.email() == null || request.email().isBlank()
                || request.salary() < 0 || request.departmentId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Provide a name, email, non-negative salary, and department."));
        }
        if (departmentService.getById(request.departmentId()) == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Selected department does not exist."));
        }
        return null;
    }

    private boolean hasRole(HttpSession session, String... allowed) {
        Object role = session.getAttribute("role");
        if (role == null) return false;
        for (String item : allowed) if (item.equals(role)) return true;
        return false;
    }
    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Please log in."));
    }
    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Your role cannot perform this action."));
    }
}
