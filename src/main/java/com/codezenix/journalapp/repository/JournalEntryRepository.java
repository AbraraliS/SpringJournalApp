package com.codezenix.journalapp.repository;

import com.codezenix.journalapp.entity.JournalEntry;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


public interface JournalEntryRepository extends MongoRepository<JournalEntry, ObjectId> {
    
}
