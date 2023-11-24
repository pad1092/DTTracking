package ducpa.dttracking.restcontroller;

import ducpa.dttracking.service.DeviceDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TestRestController {
    @Autowired
    private DeviceDataService deviceDataService;

    @GetMapping("/push")
    public void testPushMessage(){
        deviceDataService.handleIncomingData("0001", "$GPRMC,112431.00,A,2100.82457,N,10546.60044,E,1.431,236.37,231123,,,A*61");
    }
}
