package ducpa.dttracking.restcontroller;

import ducpa.dttracking.entity.Alert;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.service.AlertService;
import ducpa.dttracking.service.UtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AlertRestController {
    @Autowired
    private AlertService service;
    @Autowired
    private UtilService utilService;
    @PostMapping("/danger-zones")
    public ResponseEntity<String> addNewDangerZone(@RequestBody Alert alert, Authentication authentication){
        if (authentication == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Go to login");
        }
        User user = utilService.getUserByRequest(authentication);
        alert.setUser(user);
        service.addNewAlert(alert);

        return ResponseEntity.ok("success");

    }

    @PutMapping("/danger-zones")
    public ResponseEntity<String> updateDangerZone(@RequestBody Alert dangerZone, Authentication authentication){
        if (authentication == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Go to login");
        }
        User user = utilService.getUserByRequest(authentication);
        dangerZone.setUser(user);
        service.addNewAlert(dangerZone);

        return ResponseEntity.ok("success");

    }

    @DeleteMapping("/danger-zones/{id}")
    public ResponseEntity<String> deleteDangerZone(Authentication authentication, @PathVariable("id") Long dangerZoneId) {
        if (authentication == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Go to login");
        }
        User user = utilService.getUserByRequest(authentication);
        service.deleteAlert(user, dangerZoneId);
        return ResponseEntity.ok("success");
    }
}
