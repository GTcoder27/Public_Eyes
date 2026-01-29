package Main.service;


import Main.dto.ComplaintResponseDto;
import Main.dto.MediaTypes;
import Main.entity.Complaint;
import Main.entity.Media;
import Main.entity.User;
import Main.repository.ComplaintRepository;
import Main.repository.MediaRepository;
import Main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ComplaintService {
    public final MediaRepository mediaRepository;
    public final ComplaintRepository complaintRepository;
    public final UserRepository userRepository;


    public ComplaintResponseDto makeComplaint(List<String> evidenceUrls,String message) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User not authenticated");
        }
        User user = (User) authentication.getPrincipal();

        Complaint complaint = new Complaint();
        complaint.setMessage(message);
        complaint.setUser(user);
        complaint.setStatus("UPLOADED");
        Long userId = user.getId();
        complaintRepository.save(complaint);
        if(evidenceUrls != null && !evidenceUrls.isEmpty()){
            List<Media> mediaList = evidenceUrls.stream().map(url -> {
                Media media = new Media();
                media.setSourceUrl(url);
                media.setComplaint(complaint);
                if (url.contains(".mp4") || url.contains(".mov") || url.contains("/video/")) {
                    media.setMediaType(MediaTypes.VIDEO);
                } else {
                    media.setMediaType(MediaTypes.IMAGE);
                }
                return media;
            }).toList();
            mediaRepository.saveAll(mediaList);
        }
        return new ComplaintResponseDto(complaint.getId(),"SUBMITED",message,evidenceUrls);
    }

    public List<ComplaintResponseDto> getAllComplaintsOfUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User not authenticated");
        }
        User user = (User) authentication.getPrincipal();
        List<Complaint> complaints = complaintRepository.findAllByUser(user);
        return complaints.stream()
                .map(complaint -> {
                    List<String> mediaUrls = complaint.getMedias().stream()
                            .map(media -> media.getSourceUrl())
                            .toList();
                    return new ComplaintResponseDto(
                            complaint.getId(),
                            complaint.getStatus(),
                            complaint.getMessage(),
                            mediaUrls);
                })
                .toList();
    }

}
