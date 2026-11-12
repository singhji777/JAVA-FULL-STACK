package com.example.employee.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/", "/index.html", "/assets/**", "/favicon.ico",
                    "/api/auth/**", "/api/employees/**", "/api/departments/**",
                    "/css/**", "/js/**", "/swagger-ui/**", "/v3/api-docs/**"
                ).permitAll()
                .anyRequest().permitAll()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );
        return http.build();
    }
}
