package com.example.employee.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Forwards direct browser visits and refreshes of React routes to the SPA entry point. */
@Controller
public class ReactForwardController {
    @GetMapping({
        "/", "/login", "/dashboard", "/employees", "/employees/new",
        "/employees/edit/{id}", "/departments"
    })
    public String forwardToReact() {
        return "forward:/index.html";
    }
}
