package Main.controller;


import Main.dto.ComplaintRequestDto;
import Main.dto.ComplaintResponseDto;
import Main.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
    public final ComplaintService complaintService;

    @PostMapping("/make/complaint")
    public ResponseEntity<ComplaintResponseDto> makeComplaint(@RequestBody ComplaintRequestDto complaintRequestDto){
        return ResponseEntity.ok(complaintService.makeComplaint(complaintRequestDto.getEvidenceUrls(),complaintRequestDto.getMessage()));
    }

    @GetMapping("/all/complaints")
    public ResponseEntity<List<ComplaintResponseDto>> getAllComplaintsOfUser(){
        return ResponseEntity.ok(complaintService.getAllComplaintsOfUser());
    }

}
