package com.examly.springapp.repository;

import com.examly.springapp.audit.RegularAuditModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegularAuditRepository extends JpaRepository<RegularAuditModel, String> {

}
