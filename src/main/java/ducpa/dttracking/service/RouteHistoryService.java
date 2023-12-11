package ducpa.dttracking.service;

import ducpa.dttracking.dto.LastRouteHistoryDataDTO;
import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.RouteHistory;
import ducpa.dttracking.entity.RouteHistoryData;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.DeviceRepository;
import ducpa.dttracking.repository.RouteHistoryDataRepository;
import ducpa.dttracking.repository.RouteHistoryRepository;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteHistoryService {
    @Autowired
    private RouteHistoryRepository routeHistoryRepository;
    @Autowired
    private RouteHistoryDataRepository routeHistoryDataRepository;
    @Autowired
    private DeviceRepository deviceRepository;

    public RouteHistory createAndSaveNewRoute(String deviceID, RouteHistoryData routeHistoryData) {
        RouteHistory routeHistory = new RouteHistory();
        routeHistory.setDevice(this.deviceRepository.getDeviceById(deviceID));
        routeHistory.setDate(new Date(System.currentTimeMillis()));
        routeHistory.setRouteHistoryData(new ArrayList<>());
        routeHistory.getRouteHistoryData().add(routeHistoryData);
        this.routeHistoryRepository.saveAndFlush(routeHistory);
        return routeHistory;
    }

    public List<RouteHistory> getListRouteHistoriesByDeviceAndDate(User user, String deviceID, Long dateTimestamp){
        // check if users use this deviceID;
        Device device = deviceRepository.findByUserDeviceAndId(user, deviceID);
        if (device == null){
            return null;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT+7"));
        String formattedDate = sdf.format(new Date(dateTimestamp));
        java.sql.Date date = java.sql.Date.valueOf(formattedDate);
        System.out.println("DUCPA Timestamp: " + date.getTime());
        System.out.println("DUCPA date: " + date);
        List<RouteHistory> routeHistories = routeHistoryRepository.findAllByDeviceAndDate(device, date);
        routeHistories.forEach(routeHistory -> {
            routeHistory.setDevice(null);
            routeHistory.getRouteHistoryData().forEach(routeHistoryData -> {routeHistoryData.setRouteHistory(null);});
        });
        System.out.println("DUCPA routeHistories's size: " + routeHistories.size());
        return routeHistories;
    }

    public LastRouteHistoryDataDTO getLastUpdate(User user, String deviceID){
        Device device = deviceRepository.findByUserDeviceAndId(user, deviceID);
        if (device == null){
            return null;
        }
        RouteHistory lastRoute = routeHistoryRepository.findTopByDeviceOrderByIdDesc(device);
        RouteHistoryData lastData = routeHistoryDataRepository.findTopByRouteHistoryOrderByIdDesc(lastRoute);

        LastRouteHistoryDataDTO lastRouteHistoryDataDTO = new LastRouteHistoryDataDTO();
        lastRouteHistoryDataDTO.setLatitude(lastData.getLatitude());
        lastRouteHistoryDataDTO.setLongitude(lastData.getLongitude());
        lastRouteHistoryDataDTO.setTime(lastData.getTime() + " " + lastRoute.getDate());
        return lastRouteHistoryDataDTO;
    }
}
