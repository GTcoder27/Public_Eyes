package Main.entity;


import Main.dto.ComplaintResponseDto;
import jakarta.persistence.*;
import Main.dto.MediaTypes;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "media")
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sourceUrl;

    @Enumerated(EnumType.STRING)
    private MediaTypes mediaType;

    @ManyToOne
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;
}

