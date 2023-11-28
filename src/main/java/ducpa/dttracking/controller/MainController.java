package ducpa.dttracking.controller;

import ducpa.dttracking.entity.User;
import ducpa.dttracking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Collection;

@Controller
public class MainController {
    @Autowired
    private UserService userService;

    @GetMapping("")
    public String index(Authentication authentication){
        if (authentication != null){
            return "redirect:/home";
        }
        return "redirect:/login";
    }

    @GetMapping("/home")
    public String home(Authentication authentication){
        if (authentication == null){
            return "redirect:/login";
        }
        Object principal = authentication.getPrincipal();
        System.out.println(authentication.getName());
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            org.springframework.security.core.userdetails.UserDetails userDetails =
                    (org.springframework.security.core.userdetails.UserDetails) principal;
            Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
            for (GrantedAuthority authority : authorities) {
                String role = authority.getAuthority();
                System.out.println(role);
                if (role.equals("ROLE_USER"))
                    return "redirect:/users/devices";
                if (role.equals("ROLE_ADMIN"))
                    return "redirect:/managers/users";
            }
            return "Your response based on roles";
        } else {
            return "redirect:/login";
        }
    }

    @GetMapping("/login")
    public String login(Authentication authentication){
//        if (authentication != null){
//            return "redirect:/home";
//        }
        return "login";
    }
    @GetMapping("/signup")
    public String signup(){
        return "signup";
    }

    @PostMapping("/signup")
    public String register(@ModelAttribute("user") User user){
        userService.saveUser(user);
        return "redirect:/login";
    }
}