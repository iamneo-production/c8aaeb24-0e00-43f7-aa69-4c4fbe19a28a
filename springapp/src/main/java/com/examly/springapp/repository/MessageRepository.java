package com.examly.springapp.repository;

import com.examly.springapp.model.MessageModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<MessageModel, String> {

}
