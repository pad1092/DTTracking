package ducpa.dttracking.service;

import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.RouteHistory;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.DeviceRepository;
import ducpa.dttracking.repository.RouteHistoryRepository;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteHistoryService {
    @Autowired
    private RouteHistoryRepository routeHistoryRepository;
    @Autowired
    private DeviceRepository deviceRepository;

    public RouteHistory createAndSaveNewRoute(String deviceID) {
        RouteHistory routeHistory = new RouteHistory();
        routeHistory.setDevice(this.deviceRepository.getDeviceById(deviceID));
        routeHistory.setDate(new Date(System.currentTimeMillis()));
        this.routeHistoryRepository.saveAndFlush(routeHistory);
        return routeHistory;
    }

    public List<RouteHistory> getListRouteHistoriesByDeviceAndDate(User user, String deviceID, Long dateTimestamp){
        // check if users use this deviceID;
        Device device = deviceRepository.findByUserDeviceAndId(user, deviceID);
        if (device == null){
            return null;
        }
        Date date = new Date(dateTimestamp);
        List<RouteHistory> routeHistories = routeHistoryRepository.findAllByDeviceAndDate(device, date);
        routeHistories.forEach(routeHistory -> {
            routeHistory.setDevice(null);
            routeHistory.getRouteHistoryData().forEach(routeHistoryData -> {routeHistoryData.setRouteHistory(null);});
        });
        return routeHistories;
    }
}
