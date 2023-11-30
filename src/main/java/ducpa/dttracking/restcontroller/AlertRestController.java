package ducpa.dttracking.restcontroller;

import ducpa.dttracking.entity.Alert;
import ducpa.dttracking.service.SchedulerService;
import ducpa.dttracking.service.UtilService;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AlertRestController {
    @Autowired
    private SchedulerService schedulerService;
    @Autowired
    private UtilService utilService;
    @PostMapping("/alerts")
    public ResponseEntity<?> createAleart(@RequestBody Alert alert, @RequestParam List<String> devicesID, Authentication authentication){
        System.out.println(alert);
        System.out.println(devicesID);
        if (authentication == null){
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Go to login");
        }
        String userphone = utilService.getUserByRequest(authentication).getPhone();
        try {
            schedulerService.scheduleJob(alert, devicesID, userphone);
            return ResponseEntity.ok("Job scheduled successfully");
        } catch (SchedulerException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error scheduling job");
        }
    }
}
