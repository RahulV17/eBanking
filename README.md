# eBanking

A backend application for internet banking built with Spring Boot. The project provides user management, account operations, payment processing, authentication, caching, and API documentation.

## Features

* User and account management
* CRUD operations for banking entities
* JWT-based authentication and authorization
* Razorpay payment integration
* Redis caching support
* OpenAPI/Swagger documentation
* Spring Boot Actuator monitoring
* Email service integration

## Technology Stack

* Java 17
* Spring Boot
* Spring Security
* Spring Data JPA
* Spring Mail
* Spring Data Redis
* MySQL
* Redis
* JWT (io.jsonwebtoken)
* MapStruct
* Lombok
* Razorpay Java SDK
* Springdoc OpenAPI

## Project Structure

```text
src/main/java/com/jsp/ebanking
├── controller
├── service
├── repository
├── entity
├── dto
├── mapper
├── config
└── util

src/main/resources
├── application.properties
└── static

pom.xml
```

## Prerequisites

* Java 17
* Maven 3.8 or higher
* MySQL Server
* Redis Server (optional)
* Razorpay account and API credentials (for payment functionality)

## Configuration

Configure the application in `src/main/resources/application.properties`.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ebanking
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

spring.jpa.hibernate.ddl-auto=update

spring.redis.host=localhost
spring.redis.port=6379

jwt.secret=your_jwt_secret

razorpay.key=your_razorpay_key
razorpay.secret=your_razorpay_secret
```

Do not commit secrets or credentials to version control. Use environment variables or a secret management solution for production deployments.

## Running the Application

Using Maven Wrapper:

Windows:

```bash
mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
./mvnw spring-boot:run
```

Build the project:

```bash
./mvnw clean package
```

Run the generated JAR:

```bash
java -jar target/ebanking-0.0.1-SNAPSHOT.jar
```

## API Documentation

Swagger UI is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

## Testing

Run tests using:

```bash
./mvnw test
```

## Development Notes

* Spring Boot DevTools can be used for faster development.
* Actuator endpoints provide health and monitoring information.
* Consider adding Flyway or Liquibase for database migrations.
* Review security settings before deploying to production.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make changes and run tests.
4. Commit your changes.
5. Open a pull request.

## License

No license has been specified yet. Add a LICENSE file if you plan to distribute or open-source the project.
