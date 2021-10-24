package com.examly.springapp.audit;

import com.examly.springapp.repository.RegularAuditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegularAuditService {

    @Autowired
    private RegularAuditRepository regularAuditRepository;

    public void audit(RegularAuditModel auditModel) {
        this.regularAuditRepository.save(auditModel);
    }
}
