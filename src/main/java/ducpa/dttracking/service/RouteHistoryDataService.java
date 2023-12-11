package ducpa.dttracking.service;

import ducpa.dttracking.DtTrackingApplication;
import ducpa.dttracking.entity.RouteHistory;
import ducpa.dttracking.entity.RouteHistoryData;
import ducpa.dttracking.repository.RouteHistoryDataRepository;
import ducpa.dttracking.service.RouteHistoryService;
import ducpa.dttracking.util.HttpExecutor;
import ducpa.dttracking.util.NmeaParser;
import java.util.HashMap;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RouteHistoryDataService {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private RouteHistoryService routeHistoryService;

    @Autowired
    private RouteHistoryDataRepository routeHistoryDataRepository;

    @Value("${nominatim.osm.url}")
    private String OSM_API;

    public void handleIncomingData(String deviceId, String message) {
        String destination = "/device/" + deviceId;
        this.simpMessagingTemplate.convertAndSend(destination, message);
        RouteHistoryData routeHistoryData = NmeaParser.parser(message);
        if (routeHistoryData == null)
            return;
        if (DtTrackingApplication.devicePlaceData == null)
            DtTrackingApplication.devicePlaceData = new HashMap<>();
        JSONObject historyData = (JSONObject)DtTrackingApplication.devicePlaceData.get(deviceId);
        if (DtTrackingApplication.devicePlaceData.get(deviceId) != null) {
            String url = this.OSM_API + "lat=" + routeHistoryData.getLatitude() + "&lon=" + routeHistoryData.getLongitude();
            String currentPlaceID = (String)HttpExecutor.sendGetRequest(url, "place_id");
            Long lastTimeUpdated = (Long)historyData.get("timeUpdated");
            String lastPlaceID = (String)historyData.get("placeID");
            RouteHistory updatedRoute = (RouteHistory)historyData.get("route");
            if (System.currentTimeMillis() - lastTimeUpdated.longValue() >= 1200000L)
                updatedRoute = this.routeHistoryService.createAndSaveNewRoute(deviceId, routeHistoryData);
            if (!lastPlaceID.equalsIgnoreCase(currentPlaceID)) {
                routeHistoryData.setRouteHistory(updatedRoute);
                this.routeHistoryDataRepository.save(routeHistoryData);
            }
            historyData.put("timeUpdated", System.currentTimeMillis());
            historyData.put("route", updatedRoute);
            historyData.put("placeID", currentPlaceID);
            historyData.put("longitude", routeHistoryData.getLongitude());
            historyData.put("latitude", routeHistoryData.getLatitude());
        } else {
            JSONObject newData = new JSONObject();
            newData.put("timeUpdated", System.currentTimeMillis());
            RouteHistory routeHistory = this.routeHistoryService.createAndSaveNewRoute(deviceId, routeHistoryData);
            newData.put("route", routeHistory);
            newData.put("placeID", "");
            newData.put("longitude", routeHistoryData.getLongitude());
            newData.put("latitude", routeHistoryData.getLatitude());
            DtTrackingApplication.devicePlaceData.put(deviceId, newData);
        }
    }
}
