package ducpa.dttracking.service;

import ducpa.dttracking.entity.Alert;
import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.DeviceAlert;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.AlertRepository;
import ducpa.dttracking.repository.DeviceAlertRepository;
import ducpa.dttracking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {
    @Autowired
    private AlertRepository alertRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DeviceAlertRepository deviceAlertRepository;
    public void addNewAlert(Alert alert){
        alertRepository.save(alert);
    }

    public void deleteAlert(User user, Long alertID){
        Alert alert = alertRepository.getById(alertID);
        user.setAlerts(null);
        userRepository.save(user);
        alert.setUser(null);
        alertRepository.delete(alert);
    }

    public List<Alert> searchAlert(User user, String keyword, String type, String deviceID){
        System.out.println(keyword);
        List<Alert> res
                = user.getAlerts()
                .stream()
                .filter(alert -> (  alert.getName().toLowerCase().contains(keyword.toLowerCase()) ||
                                    alert.getDescription().toLowerCase().contains(keyword.toLowerCase())) &&
                        (alert.getType().equalsIgnoreCase(type) || type.equalsIgnoreCase("ALL")))
                .collect(Collectors.toList());
        res.forEach(alert -> {
            alert.setDeviceAlertList(null);
            alert.setUser(null);
        });

        List<DeviceAlert> deviceAlerts = deviceAlertRepository.getAllByDevice_Id(deviceID);
        deviceAlerts.forEach(deviceAlert -> {
            res.remove(deviceAlert.getAlert());
        });

        return res;
    }
}
