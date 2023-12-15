package ducpa.dttracking.restcontroller;

import ducpa.dttracking.entity.DangerZone;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.service.DangerZoneService;
import ducpa.dttracking.service.UtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class DangerZoneRestController {
    @Autowired
    private DangerZoneService service;
    @Autowired
    private UtilService utilService;
    @PostMapping("/danger-zones")
    public ResponseEntity<String> addNewDangerZone(@RequestBody DangerZone dangerZone, Authentication authentication){
        if (authentication == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Go to login");
        }
        User user = utilService.getUserByRequest(authentication);
        dangerZone.setUser(user);
        service.addNewDangerZone(dangerZone);

        return ResponseEntity.ok("success");

    }

    @PutMapping("/danger-zones")
    public ResponseEntity<String> updateDangerZone(@RequestBody DangerZone dangerZone, Authentication authentication){
        if (authentication == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Go to login");
        }
        User user = utilService.getUserByRequest(authentication);
        dangerZone.setUser(user);
        service.addNewDangerZone(dangerZone);

        return ResponseEntity.ok("success");

    }

    @DeleteMapping("/danger-zones/{id}")
    public ResponseEntity<String> deleteDangerZone(Authentication authentication, @PathVariable("id") Long dangerZoneId) {
        if (authentication == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Go to login");
        }
        User user = utilService.getUserByRequest(authentication);
        service.deleteDangerZone(user, dangerZoneId);
        return ResponseEntity.ok("success");
    }
}
