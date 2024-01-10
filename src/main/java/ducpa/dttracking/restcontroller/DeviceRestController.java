package ducpa.dttracking.restcontroller;

import ducpa.dttracking.service.DeviceAlertService;
import ducpa.dttracking.service.DeviceService;
import ducpa.dttracking.service.UtilService;
import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DeviceRestController {
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private UtilService utilService;
    @Autowired
    private DeviceAlertService deviceAlertService;
    @GetMapping("/users/devices/name/{key}")
    public List<Device> getDevicesByName(@PathVariable String key, Authentication authentication){
        User user = utilService.getUserByRequest(authentication);
        return deviceService.findByNameContainKey(key, user);
    }
    @GetMapping("/devices/{id}/alerts")
    public ResponseEntity<?> getListAlertOfDevice(@PathVariable("id") String deviceID, Authentication authentication){
        User user = utilService.getUserByRequest(authentication);
        return ResponseEntity.ok(deviceService.getListAlertOfDeviceByUserAndId(user, deviceID));
    }
}
