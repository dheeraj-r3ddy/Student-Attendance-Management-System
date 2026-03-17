package com.attendance.repository;

import com.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.department) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.section) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Student> searchStudents(@Param("search") String search);
    
    List<Student> findByDepartmentAndYearAndSection(String department, String year, String section);
}
