package ducpa.dttracking.restcontroller;

import ducpa.dttracking.service.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserRestController {
    @Autowired
    private UserService userService;

    @GetMapping("/user/exits")
    public ResponseEntity<?> checkExit(@RequestParam String phone, @RequestParam String email){
        System.out.print(phone);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(userService.checkExit(phone, email).toString());
    }
}
