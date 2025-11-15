package com.aprendizaje.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración de CORS (Cross-Origin Resource Sharing)
 * Permite que el frontend (React) pueda comunicarse con el backend
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Configura qué orígenes pueden acceder a la API
     * @param registry - Registro de configuración CORS
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Aplica a todas las rutas que empiecen con /api
                .allowedOrigins("http://localhost:3000") // Permite peticiones desde React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // Métodos HTTP permitidos
                .allowedHeaders("*"); // Permite todos los headers
    }
}
