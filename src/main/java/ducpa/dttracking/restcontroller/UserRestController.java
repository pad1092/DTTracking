package ducpa.dttracking.restcontroller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.service.DeviceService;
import ducpa.dttracking.service.UserService;
import ducpa.dttracking.service.UtilService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserRestController {
    @Autowired
    private UserService userService;
    @Autowired
    private UtilService utilService;
    @Autowired
    private DeviceService deviceService;

    @GetMapping("/exits")
    public ResponseEntity<?> checkExit(@RequestParam String phone, @RequestParam String email){
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(userService.checkExit(phone, email).toString());
    }

    @GetMapping("/users/devices")
    public List<Device> getAllDeviceOfUser(Authentication authentication){
        User user = utilService.getUserByRequest(authentication);
        return userService.getListDeviceOfUser(user);
    }

    @DeleteMapping("/users/devices/{id}")
    public void deleteDeviceById(@PathVariable String id) {
        deviceService.unactiveDevice(id);
    }

    @PutMapping("/users/devices/{id}")
    public void update(@RequestParam("device") String deviceString,
                       @RequestParam("imageFile") MultipartFile imageFile,
                       Authentication authentication){
        Device device = utilService.stringToDevice(deviceString);
        User user = utilService.getUserByRequest(authentication);
        device.setImageUrl(utilService.storageFile(imageFile));
        deviceService.updateDevice(device, user);
    }

    @PostMapping("/users/devices/active")
    public ResponseEntity<?> activeDevice(@RequestParam("device") String deviceString,
                                          @RequestParam("imageFile") MultipartFile imageFile,
                                          Authentication authentication){
        Device device = utilService.stringToDevice(deviceString);
        User user = utilService.getUserByRequest(authentication);
        device.setImageUrl(utilService.storageFile(imageFile));
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(deviceService.activeNewDevice(user, device));
    }
    @PostMapping("/users/devices/active-list")
    public ResponseEntity<?> activeListDevice(@RequestBody List<Device> devices, Authentication authentication){
        User user = utilService.getUserByRequest(authentication);

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(deviceService.activeListNewDevice(user, devices));
    }

    @GetMapping("/users/danger-zones")
    public ResponseEntity<?> getListDangerZone(Authentication authentication){
        User user = utilService.getUserByRequest(authentication);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(userService.getDngerZoneList(user));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword( @RequestBody User user, @RequestParam String otp, @RequestParam String email){
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(userService.resetPassword(email, otp, user.getPassword()));
    }
}
