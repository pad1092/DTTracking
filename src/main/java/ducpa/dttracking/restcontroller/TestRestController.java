package ducpa.dttracking.restcontroller;

import ducpa.dttracking.service.RouteHistoryDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping({"/api/test"})
public class TestRestController {
    @Autowired
    private RouteHistoryDataService routeHistoryDataService;

    @GetMapping({"/push"})
    public void testPushMessage() {
        this.routeHistoryDataService.handleIncomingData("0001", "$GPRMC,112431.00,A,2100.82457,N,10546.60044,E,1.431,236.37,231123,,,A*61");
    }

    @PostMapping({"/routes/{deviceID}"})
    public Object testRoutes(@PathVariable("deviceID") String deviceID, @RequestBody String data) {
        this.routeHistoryDataService.handleIncomingData(deviceID, data);
        return data;
    }
}
