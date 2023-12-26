package ducpa.dttracking.restcontroller;

import ducpa.dttracking.service.UserService;
import ducpa.dttracking.util.OptUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class OptRestController {
    @Autowired
    private UserService userService;
    @Autowired
    private OptUtil optUtil;
    @GetMapping("/generate-otp")
    public ResponseEntity<?> generateOtp(@RequestParam String email){
        System.out.println("RESET"  +  "-" + email);
        return ResponseEntity.ok(userService.resetPassword(email));
    }
    @GetMapping("/validate-otp")
    public ResponseEntity<?> validateOtp(@RequestParam String email, @RequestParam String otp){
        System.out.println("RESET"  +  "-" + email);
        return ResponseEntity.ok(optUtil.validateOtp(email, otp));
    }
}
