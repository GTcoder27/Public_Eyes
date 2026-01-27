package Main.controller;


import Main.dto.LoginRequestDto;
import Main.dto.LoginResponseDto;
import Main.dto.RegisterRequestDto;
import Main.dto.RegisterResponseDto;
import Main.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    public final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@RequestBody RegisterRequestDto registerRequestDto){
        return ResponseEntity.ok(authService.register(registerRequestDto.getEmail(),registerRequestDto.getName(),registerRequestDto.getPassword()));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto){
        return ResponseEntity.ok(authService.login(loginRequestDto.getEmail(),loginRequestDto.getPassword()));
    }




}
