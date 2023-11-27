package ducpa.dttracking.service;

import ducpa.dttracking.DtTrackingApplication;
import ducpa.dttracking.util.entity.DeviceData;
import ducpa.dttracking.repository.DeviceDataRepository;
import ducpa.dttracking.util.HttpExecutor;
import ducpa.dttracking.util.NmeaParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class DeviceDataService {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private DeviceDataRepository deviceDataRepository;

    @Value("${nominatim.osm.url}")
    private String OSM_API;
    public void handleIncomingData(String deviceId, String message){
        // push data to socket
        String destination = "/device/" + deviceId;
        simpMessagingTemplate.convertAndSend(destination, message);

        DeviceData deviceData = NmeaParser.parser(message);
        // if data is invalid then return
        if (deviceData == null){
            return;
        }
        String url = OSM_API + "lat=" + deviceData.getLatitude() + "&lon=" + deviceData.getLongitude();
        deviceData.setDeviceId(deviceId);
        String newPlaceID = (String) HttpExecutor.sendGetRequest(url, "place_id");
        String oldPlaceID = "";

        if (DtTrackingApplication.devicePlaceData == null){
            DtTrackingApplication.devicePlaceData = new HashMap<>();
        }
        if (DtTrackingApplication.devicePlaceData.get(deviceId) != null){
            oldPlaceID = DtTrackingApplication.devicePlaceData.get(deviceId);
        }

        if (newPlaceID.equalsIgnoreCase(oldPlaceID)){
            return;
        }

        DtTrackingApplication.devicePlaceData.put(deviceId, newPlaceID);
        deviceDataRepository.save(deviceData);
    }
}
