package ducpa.dttracking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class UserController {
    @GetMapping("/user")
    public String user(){
        return "user";
    }
    @GetMapping("/manager")
    public String manager(){
        return "manager";
    }
}
