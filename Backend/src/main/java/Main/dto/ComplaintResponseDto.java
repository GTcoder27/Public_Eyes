package Main.dto;

import Main.entity.Media;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintResponseDto {
    private Long id;
    private String status;
    private String message;
    private List<String> evidenceUrls;
}
