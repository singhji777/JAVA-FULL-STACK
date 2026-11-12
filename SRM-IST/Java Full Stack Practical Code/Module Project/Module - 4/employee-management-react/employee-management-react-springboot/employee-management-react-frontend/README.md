# Employee Management System — React + Existing Spring Boot Backend

This package is intended to add a React front end to the Spring Boot project described in the supplied project document.

## Folder guide
- `src/`: React front end source
- `backend-integration/`: replacement Spring Boot controller/configuration source files for the minimal REST API integration
- `src/services/api.js`: fetch requests to `/api/...`

## Run as a React development server
The React app calls relative `/api` paths. For local Vite development, add this proxy to `vite.config.js` and make sure Spring Boot is running on port 8080:

```js
server: {
  port: 5173,
  proxy: {
    "/api": "http://localhost:8080"
  }
}
```

Then run:

```bash
npm install
npm run dev
```

## Serve React from Spring Boot (recommended for this setup)
Build the React app:

```bash
npm install
npm run build
```

Copy everything inside `dist/` into your existing Spring Boot project folder:

`src/main/resources/static/`

The compiled React app is then served from the same origin as Spring Boot. Start the backend with `mvn spring-boot:run` and open `http://localhost:8080`.

## Keep the existing backend
Preserve the existing model and service classes and `pom.xml`. For full integration, use the replacement controller/configuration files in `backend-integration/`:
- `LoginController.java`
- `EmployeeController.java`
- `DepartmentController.java`
- `DashboardController.java`
- `ReactForwardController.java`
- `SecurityConfig.java`

These are the minimal server-side changes needed because the current controllers return Thymeleaf template names rather than JSON. See `backend-integration/README.md` for endpoint details and caveats.

## Role behavior
- HR: view, add, edit, and delete employees; add departments.
- Manager: view and edit employees.
- Employee: view employees and departments.
- Login demo accounts remain `hr / 1234`, `manager / 1234`, and `employee / 1234`.

## Data storage
The existing Java services use `ArrayList`, so React reads and changes the backend's in-memory data through the REST API. Records reset when the Spring Boot process restarts. The React app does not use its own sample data for CRUD.

## Security warning
This retains the original classroom project's fixed demo credentials and session-stored JWT approach. It is not production-ready authentication. Do not deploy publicly without replacing demo credentials, securing authentication, and reviewing CSRF/session authorization.
