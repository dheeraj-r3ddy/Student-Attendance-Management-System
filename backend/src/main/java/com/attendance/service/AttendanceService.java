package com.attendance.service;

import com.attendance.dto.AttendanceDTO;
import com.attendance.model.AttendanceRecord;
import com.attendance.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Transactional
    public Map<String, Object> markAttendance(List<AttendanceDTO> records) {
        int recordsCreated = 0;

        for (AttendanceDTO dto : records) {
            Optional<AttendanceRecord> existingRecord = attendanceRepository
                    .findByStudentIdAndSubjectAndClassNameAndDate(
                            dto.getStudentId(),
                            dto.getSubject(),
                            dto.getClassName(),
                            dto.getDate()
                    );

            AttendanceRecord record;
            if (existingRecord.isPresent()) {
                record = existingRecord.get();
                record.setStatus(AttendanceRecord.Status.valueOf(dto.getStatus().toUpperCase()));
            } else {
                record = new AttendanceRecord();
                record.setStudentId(dto.getStudentId());
                record.setStudentName(dto.getStudentName());
                record.setSubject(dto.getSubject());
                record.setClassName(dto.getClassName());
                record.setDate(dto.getDate());
                record.setStatus(AttendanceRecord.Status.valueOf(dto.getStatus().toUpperCase()));
                recordsCreated++;
            }

            attendanceRepository.save(record);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Attendance marked successfully");
        response.put("recordsCreated", recordsCreated);
        return response;
    }

    public Map<String, Object> getAttendanceRecords(String studentName, String subject, 
                                                     String className, LocalDate startDate, LocalDate endDate) {
        List<AttendanceRecord> records = attendanceRepository.findWithFilters(
                studentName, subject, className, startDate, endDate
        );

        List<AttendanceDTO> recordDTOs = records.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        long totalRecords = recordDTOs.size();
        long totalPresent = recordDTOs.stream()
                .filter(r -> r.getStatus().equalsIgnoreCase("present"))
                .count();
        int overallPercentage = totalRecords > 0 ? (int) Math.round((double) totalPresent / totalRecords * 100) : 0;

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalRecords", totalRecords);
        statistics.put("totalPresent", totalPresent);
        statistics.put("overallPercentage", overallPercentage);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("records", recordDTOs);
        response.put("statistics", statistics);

        return response;
    }

    public Map<String, Object> getStudentWiseReport(String studentName, String subject, 
                                                     String className, LocalDate startDate, LocalDate endDate) {
        List<AttendanceRecord> records = attendanceRepository.findWithFilters(
                studentName, subject, className, startDate, endDate
        );

        Map<Long, AttendanceDTO.StudentStatDTO> statsMap = new HashMap<>();

        for (AttendanceRecord record : records) {
            Long studentId = record.getStudentId();
            statsMap.putIfAbsent(studentId, new AttendanceDTO.StudentStatDTO(
                    studentId, record.getStudentName(), 0L, 0L, 0
            ));

            AttendanceDTO.StudentStatDTO stat = statsMap.get(studentId);
            stat.setTotal(stat.getTotal() + 1);
            if (record.getStatus() == AttendanceRecord.Status.PRESENT) {
                stat.setPresent(stat.getPresent() + 1);
            }
        }

        List<AttendanceDTO.StudentStatDTO> studentStats = statsMap.values().stream()
                .map(stat -> {
                    int percentage = stat.getTotal() > 0 
                            ? (int) Math.round((double) stat.getPresent() / stat.getTotal() * 100) 
                            : 0;
                    stat.setPercentage(percentage);
                    return stat;
                })
                .sorted(Comparator.comparing(AttendanceDTO.StudentStatDTO::getName))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("studentStats", studentStats);

        return response;
    }

    public List<String> getDistinctSubjects() {
        return attendanceRepository.findDistinctSubjects();
    }

    public List<String> getDistinctClasses() {
        return attendanceRepository.findDistinctClasses();
    }

    private AttendanceDTO convertToDTO(AttendanceRecord record) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(record.getId());
        dto.setStudentId(record.getStudentId());
        dto.setStudentName(record.getStudentName());
        dto.setSubject(record.getSubject());
        dto.setClassName(record.getClassName());
        dto.setDate(record.getDate());
        dto.setStatus(record.getStatus().name().toLowerCase());
        return dto;
    }
}
