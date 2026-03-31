# Backend Dockerfile (Spring Boot)
# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only what is needed and build
COPY pom.xml .
COPY src ./src

RUN mvn -B clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/attendance-backend-1.0.0.jar ./attendance-backend.jar

EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/attendance-backend.jar"]
