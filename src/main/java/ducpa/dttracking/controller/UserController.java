package ducpa.dttracking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller

public class UserController {
    @GetMapping("/users/devices")
    public String userDevices(){
        return "user/devices";
    }
    @GetMapping("/users/tracking")
    public String userTracking(){
        return "user/tracking";
    }
    @GetMapping("/users/route")
    public String userRoute(){
        return "user/route";
    }
    @GetMapping("/users/notification-settings")
    public String setUpleart(){
        return "/user/setup-alert";
    }
}
