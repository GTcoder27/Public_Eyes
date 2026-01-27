package Main.security;


import Main.dto.LoginResponseDto;
import Main.dto.RegisterResponseDto;
import Main.dto.Roles;
import Main.entity.User;
import Main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {

    public final UserRepository userRepository;
    public final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public RegisterResponseDto register(String email, String name, String password) {
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Roles.valueOf("USER"));
        if(userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email Already Exists 👺");
        }
        userRepository.save(user);
        return new RegisterResponseDto(email,"user registered successfully 👍");
    }

    public LoginResponseDto login(String email, String password) {
        Roles role = Roles.valueOf("USER");
        if(!userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email Don't Exists 👺");
        }
        User user = userRepository.findByEmail(email);
        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new IllegalArgumentException("Wrong Password 👺");
        }
        String access_token = jwtService.generateAccessToken(user);
        return new LoginResponseDto(access_token, user.getId());
    }


}
















