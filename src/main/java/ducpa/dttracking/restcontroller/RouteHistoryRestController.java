package ducpa.dttracking.restcontroller;

import ducpa.dttracking.entity.RouteHistory;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.service.RouteHistoryService;
import ducpa.dttracking.service.UserService;
import ducpa.dttracking.service.UtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RouteHistoryRestController {
    @Autowired
    private UtilService utilService;
    @Autowired
    private RouteHistoryService routeHistoryService;
    @GetMapping("/route-history")
    public List<RouteHistory> getListRouteHistoriesByDeviceAndDate(@RequestParam String deviceID,
                                                            @RequestParam Long date,
                                                            Authentication authentication){
        User user = utilService.getUserByRequest(authentication);
        return routeHistoryService.getListRouteHistoriesByDeviceAndDate(user, deviceID, date);
    }

}
