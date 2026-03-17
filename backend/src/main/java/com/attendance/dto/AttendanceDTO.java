package com.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private Long id;
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    @NotBlank(message = "Student name is required")
    private String studentName;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Class is required")
    private String className;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttendanceRequest {
        @NotNull(message = "Records are required")
        private List<AttendanceDTO> records;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentStatDTO {
        private Long studentId;
        private String name;
        private Long total;
        private Long present;
        private Integer percentage;
    }
}
