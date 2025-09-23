package com.automarket.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty; // ← ДОБАВЬ ЭТО
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;


@Configuration
@ConditionalOnProperty(name = "firebase.enabled", havingValue = "true")
public class FirebaseConfig implements InitializingBean {

    @Value("${firebase.credentials.base64:}")
    private String firebaseCredsBase64;

    @Override
    public void afterPropertiesSet() throws Exception {
        if (FirebaseApp.getApps().isEmpty()) {
            GoogleCredentials creds;
            if (firebaseCredsBase64 != null && !firebaseCredsBase64.isBlank()) {
                var json = new String(Base64.getDecoder().decode(firebaseCredsBase64), StandardCharsets.UTF_8);
                creds = GoogleCredentials.fromStream(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)));
            } else {

                creds = GoogleCredentials.getApplicationDefault();
            }
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(creds)
                .build();
            FirebaseApp.initializeApp(options);
        }

    }
}
