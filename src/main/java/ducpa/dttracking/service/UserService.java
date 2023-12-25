package ducpa.dttracking.service;

import ducpa.dttracking.entity.DangerZone;
import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.UserRepository;
import ducpa.dttracking.util.MailSenderUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UtilService utilService;
    @Autowired
    private MailSenderUtil mailSender;

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
    public List<DangerZone> getDngerZoneList(User user){
        List<DangerZone> dangerZones = user.getDangerZones();
        dangerZones.forEach(dangerZone -> {
            dangerZone.setUser(null);
        });
        return dangerZones;
    }

    public boolean resetPassword(String email, String phone) {
        User user = userRepository.findByEmailAndPhone(email, phone);
        if (user == null)
            return false;
        String newPass = randomCharacter(6);
        String text = "<h4>Yêu cầu đặt lại mật khẩu của bạn đã được thực hiện.</h4>" +
                "<p>Mật khẩu mới của bạn là: <span style=\"color: red;\">" + newPass + "</span> <br />\n";
        String subject = "Quên mật khẩu";
        mailSender.sendMail(email, subject, text);

//        newPass = passwordEncoder.encode(newPass);
//        user.setPassword(newPass);
//        userRepository.saveAndFlush(user);

        return true;
    }

    private String randomCharacter(int length) {
        String alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        String res = "";
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            res += alphabet.charAt(random.nextInt(alphabet.length()));
        }
        return res;
    }

}
