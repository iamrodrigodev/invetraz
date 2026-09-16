# Etapa 1: Compilacion y empaquetado con Maven y JDK 21
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

COPY pom.xml checkstyle.xml ./

RUN mvn dependency:go-offline -B || true

COPY src ./src

RUN mvn clean package -DskipTests

# Etapa 2: Imagen ligera de ejecucion con JRE 21
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/target/*.jar app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
