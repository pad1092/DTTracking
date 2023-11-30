package ducpa.dttracking.service;

import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UtilService utilService;

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

    public List<Device> getListDeviceOfUser(User user) {
        List<Device> devices = user.getUserDevices();
        devices.forEach(device -> {
            device.setUserDevice(null);
            device.setRouteHistories(null);
            device.setDeviceAlertList(null);
        });
        return devices;
    }

}
