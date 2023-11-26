package ducpa.dttracking.service;

import com.google.gson.JsonObject;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.UserRepository;
import ducpa.dttracking.restcontroller.UserRestController;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public void saveUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");
        userRepository.save(user);
    }

    public JSONObject checkExit(String phone, String email){
        boolean checkEmail = true;
        boolean checkPhone = true;
        if (userRepository.findByPhone(phone) != null){
            checkPhone = false;
        }
        if (userRepository.findByEmail(email) != null){
            checkEmail = false;
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("email", checkEmail);
        jsonObject.put("phone", checkPhone);
        return jsonObject;
    }
}
