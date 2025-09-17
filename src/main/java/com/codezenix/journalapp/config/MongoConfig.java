package com.codezenix.journalapp.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri:mongodb://localhost:27017/journalDB}")
    private String mongoUri;

    @Override
    protected String getDatabaseName() {
        return "journalDB";
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        try {
            ConnectionString connectionString = new ConnectionString(mongoUri);
            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(connectionString)
                    .applyToConnectionPoolSettings(builder -> 
                        builder.maxConnectionIdleTime(30, TimeUnit.SECONDS)
                               .maxConnectionLifeTime(60, TimeUnit.SECONDS))
                    .applyToSocketSettings(builder -> 
                        builder.connectTimeout(5, TimeUnit.SECONDS)
                               .readTimeout(5, TimeUnit.SECONDS))
                    .applyToServerSettings(builder -> 
                        builder.heartbeatFrequency(10, TimeUnit.SECONDS)
                               .minHeartbeatFrequency(500, TimeUnit.MILLISECONDS))
                    .applyToClusterSettings(builder -> 
                        builder.serverSelectionTimeout(5, TimeUnit.SECONDS))
                    .build();
            
            return MongoClients.create(settings);
        } catch (Exception e) {
            System.err.println("Failed to connect to MongoDB Atlas, falling back to local MongoDB: " + e.getMessage());
            // Fallback to local MongoDB
            ConnectionString fallbackConnectionString = new ConnectionString("mongodb://localhost:27017/journalDB");
            MongoClientSettings fallbackSettings = MongoClientSettings.builder()
                    .applyConnectionString(fallbackConnectionString)
                    .applyToSocketSettings(builder -> 
                        builder.connectTimeout(2, TimeUnit.SECONDS)
                               .readTimeout(2, TimeUnit.SECONDS))
                    .applyToClusterSettings(builder -> 
                        builder.serverSelectionTimeout(2, TimeUnit.SECONDS))
                    .build();
            
            return MongoClients.create(fallbackSettings);
        }
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }
}