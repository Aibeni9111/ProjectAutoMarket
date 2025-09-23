package com.automarket.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {


    @Value("${app.cors.origins}")
    private String corsOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = corsOrigins.split("\\s*,\\s*");

        registry.addMapping("/api/**")
            .allowedOrigins(origins)
            .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
            .allowCredentials(true);
    }
}
