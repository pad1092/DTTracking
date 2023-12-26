package ducpa.dttracking.service;

import ducpa.dttracking.entity.DangerZone;
import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.UserRepository;
import ducpa.dttracking.util.MailSenderUtil;
import ducpa.dttracking.util.OptUtil;
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
    private OptUtil optUtil;
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
    public boolean resetPassword(String email, String otp, String password){
        if (!otp.equalsIgnoreCase(optUtil.getOtp(email)))
            return false;
        User user = userRepository.findByEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return true;
    }

    public boolean resetPassword(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null)
            return false;
        optUtil.clearOtp(email);
        String optCode = optUtil.getOtp(email);
        String text =
                "<h3>Yêu cầu đặt lại mật khẩu của bạn đã được thực hiện.</h3>" +
                "<h4>Vui lòng không tiết lộ mã OTP cho bất kì ai, mã OTP có hiệu lực trong vòng 5 phút</h4>" +
                "<div style=\"display: flex; line-height: 40px;\">Mã OTP: <div style=\"color: rgb(202, 81, 0); line-height: 40px; padding: 0 8px; border-radius: 8px;margin-left: 8px; background-color: #dfdfdf; font-size: 20px; font-weight: 600;\">"+
                        optCode+
                 "</div></div>\n";
        String subject = "Đặt lại mật mật khẩu";
        mailSender.sendMail(email, subject, text);
        return true;
    }


}
