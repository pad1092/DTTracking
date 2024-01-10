package ducpa.dttracking.service;

import ducpa.dttracking.entity.DeviceAlert;
import ducpa.dttracking.repository.DeviceAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceAlertService {
    @Autowired
    private DeviceAlertRepository deviceAlertRepository;

    public List<DeviceAlert> getAllAlertOfDevice(String deviceID){
        return deviceAlertRepository.getAllByDevice_Id(deviceID);
    }
}
