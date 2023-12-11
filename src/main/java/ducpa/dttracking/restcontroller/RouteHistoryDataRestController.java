package ducpa.dttracking.restcontroller;

import ducpa.dttracking.dto.LastRouteHistoryDataDTO;
import ducpa.dttracking.entity.RouteHistoryData;
import ducpa.dttracking.service.RouteHistoryService;
import ducpa.dttracking.service.UtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RouteHistoryDataRestController {
    @Autowired
    private UtilService utilService;
    @Autowired
    private RouteHistoryService routeHistoryService;

    @GetMapping("/devices/{id}/last")
    public LastRouteHistoryDataDTO getLastUpdate(Authentication authentication, @PathVariable("id") String deviceID){
        return  routeHistoryService.getLastUpdate(utilService.getUserByRequest(authentication), deviceID);

    }
}
