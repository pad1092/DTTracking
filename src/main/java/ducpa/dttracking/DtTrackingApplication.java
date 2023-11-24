package ducpa.dttracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class DtTrackingApplication {
    public static Map<String, String> devicePlaceData;
    public static void main(String[] args) {
        SpringApplication.run(DtTrackingApplication.class, args);
        devicePlaceData = new HashMap<>();
    }

}
