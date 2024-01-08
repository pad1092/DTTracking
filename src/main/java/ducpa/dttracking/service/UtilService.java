package ducpa.dttracking.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import ducpa.dttracking.dto.LastRouteHistoryDataDTO;
import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.RouteHistoryData;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class UtilService {
    @Autowired
    private UserRepository userRepository;
    public User getUserByRequest(Authentication authentication){
        String username = authentication.getName();
        User user = userRepository.findByPhone(username);
        return user;
    }

    @Autowired
    private Cloudinary cloudinary;

    public String storageFile(MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            try {
                Map uploadRes = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap());
                return (String) uploadRes.get("url");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "";
    }

    public Device stringToDevice(String deviceString){
        JSONObject deviceObj = new JSONObject(deviceString);
        Device device = new Device();
        device.setId((String) deviceObj.get("id"));
        device.setName((String) deviceObj.get("name"));
        device.setDescription((String) deviceObj.get("description"));
        return device;
    }

}
