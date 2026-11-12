# Spring Boot integration files

These are **replacement controller/configuration files** for the project described in your uploaded document. The React source is in `../src`.

## Important
- Keep your existing `Employee`, `Department`, `Role`, `EmployeeService`, `DepartmentService`, and `JwtService` classes.
- Replace the existing `LoginController`, `EmployeeController`, and `DepartmentController` with the versions in this folder.
- Replace `DashboardController` with the version here so `/dashboard` no longer serves a Thymeleaf page.
- Add `ReactForwardController` to forward direct visits/refreshes of React routes to `index.html`.
- Replace `SecurityConfig` with the version here so Spring Security does not block the API endpoints before the session-based role checks run.
- `DashboardController` is no longer needed for the React dashboard; you may leave the class in place, but its `/dashboard` mapping should not conflict with React static routing. If the existing class is still active, remove/disable that mapping or convert it to a non-conflicting endpoint. Use the included replacement `DashboardController.java` and `ReactForwardController.java`.
- Package names follow the uploaded project document: `com.example.employee.*`. If your actual package differs, adjust package declarations.

## API endpoints
- `POST /api/auth/login` — `{ "username": "hr", "password": "1234" }`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/employees?page=0&size=5&sortBy=name&direction=asc`
- `GET /api/employees/{id}`
- `POST /api/employees` — `{ "name":"Ravi", "email":"ravi@example.com", "salary":50000, "departmentId":1 }`
- `PUT /api/employees/{id}` — same request shape
- `DELETE /api/employees/{id}`
- `GET /api/departments`
- `POST /api/departments` — `{ "name":"Marketing" }`

## Build and serve React from Spring Boot
1. Run `npm install` in the React project folder.
2. Run `npm run build`.
3. Copy the contents of the generated `dist/` directory into `src/main/resources/static/` in the Spring Boot project. This replaces the old static CSS files with the React bundle.
4. Since the React app uses BrowserRouter, configure a forward to `/index.html` for browser routes like `/employees` and `/departments` if Spring Boot returns 404 on refresh. Do not forward `/api/**` to the React index.
5. Run the Spring Boot application and open `http://localhost:8080`.

## Security note
This is a classroom demo matching the original project's fixed demo credentials and session-stored JWT. `permitAll` allows API requests to reach controller methods, which check the session role. Do not use this design as production security; production should use a proper Spring Security authentication filter, password hashing, CSRF protection appropriate to cookie sessions, and authorization at the service/security layer.

## Scope note
The provided EmployeeService stores records in an ArrayList. This remains unchanged, so data is lost when the Spring Boot process restarts. The employee API list method requests up to 1000 items from the existing service and then returns the requested page. If you expect more than 1000 records, add a count/page API to the service (not required for this demo).
