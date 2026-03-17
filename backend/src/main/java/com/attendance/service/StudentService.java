package com.attendance.service;

import com.attendance.dto.StudentDTO;
import com.attendance.model.Student;
import com.attendance.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<StudentDTO> getAllStudents(String search) {
        List<Student> students;
        
        if (search != null && !search.isEmpty()) {
            students = studentRepository.searchStudents(search);
        } else {
            students = studentRepository.findAll();
        }

        return students.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return convertToDTO(student);
    }

    public StudentDTO createStudent(StudentDTO studentDTO) {
        Student student = new Student();
        student.setName(studentDTO.getName());
        student.setDepartment(studentDTO.getDepartment());
        student.setYear(studentDTO.getYear());
        student.setSection(studentDTO.getSection());

        Student savedStudent = studentRepository.save(student);
        return convertToDTO(savedStudent);
    }

    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        student.setName(studentDTO.getName());
        student.setDepartment(studentDTO.getDepartment());
        student.setYear(studentDTO.getYear());
        student.setSection(studentDTO.getSection());

        Student updatedStudent = studentRepository.save(student);
        return convertToDTO(updatedStudent);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setDepartment(student.getDepartment());
        dto.setYear(student.getYear());
        dto.setSection(student.getSection());
        return dto;
    }
}
