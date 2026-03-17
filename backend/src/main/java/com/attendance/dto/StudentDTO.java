package com.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotBlank(message = "Year is required")
    private String year;
    
    @NotBlank(message = "Section is required")
    private String section;
}
