package com.attendance.repository;

import com.attendance.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {
    
    Optional<AttendanceRecord> findByStudentIdAndSubjectAndClassNameAndDate(
        Long studentId, String subject, String className, LocalDate date
    );
    
    List<AttendanceRecord> findByStudentId(Long studentId);
    
    List<AttendanceRecord> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT a FROM AttendanceRecord a WHERE " +
           "(:studentName IS NULL OR LOWER(a.studentName) LIKE LOWER(CONCAT('%', :studentName, '%'))) AND " +
           "(:subject IS NULL OR a.subject = :subject) AND " +
           "(:className IS NULL OR a.className = :className) AND " +
           "(:startDate IS NULL OR a.date >= :startDate) AND " +
           "(:endDate IS NULL OR a.date <= :endDate) " +
           "ORDER BY a.date DESC, a.studentName ASC")
    List<AttendanceRecord> findWithFilters(
        @Param("studentName") String studentName,
        @Param("subject") String subject,
        @Param("className") String className,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT DISTINCT a.subject FROM AttendanceRecord a ORDER BY a.subject")
    List<String> findDistinctSubjects();
    
    @Query("SELECT DISTINCT a.className FROM AttendanceRecord a ORDER BY a.className")
    List<String> findDistinctClasses();
}
