package com.attendance.controller;

import com.attendance.dto.AttendanceDTO;
import com.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> markAttendance(
            @Valid @RequestBody AttendanceDTO.AttendanceRequest request) {
        Map<String, Object> response = attendanceService.markAttendance(request.getRecords());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/records")
    public ResponseEntity<Map<String, Object>> getAttendanceRecords(
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String className,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Map<String, Object> response = attendanceService.getAttendanceRecords(
                studentName, subject, className, startDate, endDate
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports/student-wise")
    public ResponseEntity<Map<String, Object>> getStudentWiseReport(
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String className,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Map<String, Object> response = attendanceService.getStudentWiseReport(
                studentName, subject, className, startDate, endDate
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<String>> getDistinctSubjects() {
        List<String> subjects = attendanceService.getDistinctSubjects();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/classes")
    public ResponseEntity<List<String>> getDistinctClasses() {
        List<String> classes = attendanceService.getDistinctClasses();
        return ResponseEntity.ok(classes);
    }
}
