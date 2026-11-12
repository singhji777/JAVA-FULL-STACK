# Java Full Stack: SRM IST

Class notes and practical code for the Java Full Stack course at SRM Institute of Science and Technology.

## What is in this repository

All content lives in the `SRM-IST` folder.

### Class Content

PDF notes from the lectures:

- Introduction to Java and OOPs Concept
- Interface in Java
- Maven Spring Boot Setup
- Complete Tutorial on JPA
- Request Mapping and Response Entity in Spring Boot

### Java Full Stack Practical Code

| Folder | What it contains |
|---|---|
| `Maven Project` | `first-app` and `calculator-executable-jar`, the first Maven projects |
| `Spring Core` | `first-spring-app`, `dependency-injection-ioc` and `spring-mvc` |
| `Spring Boot` | `request-mapping-controller`, a Spring Boot app with request mapping and static pages |
| `Module Project` | The five module projects, listed below |

### Module projects

| Module | Project | Notes |
|---|---|---|
| Module 1 | Inventory Management System | Plain Java application with file handling |
| Module 2 | MultiThreadedFileProcessor | Reads several CSV files at the same time using threads and builds a combined sales report |
| Module 3 | employee-management-web | Spring Boot and Thymeleaf web app with login, JWT and Spring Security, employees and departments |
| Module 4 | employee-management-react | React (Vite) frontend for the employee app, with the Spring Boot integration files and notes |
| Module 5 | hospital-appointment-system | Spring Boot, Spring Data JPA and Thymeleaf app for doctors, departments, patients and appointments |

## Running the Spring Boot projects

You need a recent JDK and Maven. Each project includes the Maven wrapper.

```
cd "SRM-IST/Java Full Stack Practical Code/Module Project/Module - 3/employee-management-web"
./mvnw spring-boot:run
```

On Windows use `mvnw.cmd spring-boot:run`. Module 5 needs a MySQL database; set the connection details in `src/main/resources/application.properties`.

## Running the React frontend

```
cd "SRM-IST/Java Full Stack Practical Code/Module Project/Module - 4/employee-management-react/employee-management-react-springboot/employee-management-react-frontend"
npm install
npm run dev
```

The `backend-integration` folder inside it has the Spring Boot controllers and notes for connecting the frontend to the backend.
