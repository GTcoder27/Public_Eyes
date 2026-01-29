package Main.error;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
public class ApiError {

    private LocalDateTime timestamp;
    private String error;
    private HttpStatus statusCode;

    public ApiError(String error,HttpStatus statusCode){
        this.error = error;
        this.statusCode = statusCode;
        this.timestamp = LocalDateTime.now();
    }
}
