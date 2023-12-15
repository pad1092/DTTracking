package ducpa.dttracking.service;

import ducpa.dttracking.entity.DangerZone;
import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.DeviceRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Service
public class DeviceService {
    @Autowired
    private DeviceRepository deviceRepository;
    public Device getDeviceById(String id){
        return deviceRepository.getDeviceById(id);
    }
    public String activeNewDevice(User user, Device device){
        System.out.println(device);
        JSONObject response = new JSONObject();
        response.put("message", "");

        Device findDevice = deviceRepository.getDeviceById(device.getId());
        if (findDevice == null || (findDevice != null && findDevice.getUserDevice() != null)){
            response.put("message", "Mã '" + device.getId() +"' không tồn tại hoặc đã được kích hoạt");
        }
        else {
            Date currDate = new Date(System.currentTimeMillis());
            device.setActiveDate(currDate);
            device.setUserDevice(user);
            deviceRepository.save(device);
        }

        return response.toString();
    }

    public String activeListNewDevice(User user, List<Device> devices){
        JSONObject response = new JSONObject();
        List<String> messages = new ArrayList<>();
        response.put("hasError", false);
        devices.forEach(device -> {
            Device findDevice = deviceRepository.getDeviceById(device.getId());
            if (findDevice == null || (findDevice != null && findDevice.getUserDevice() != null)){
                response.put("hasError", true);
                messages.add("Mã '" + device.getId() +"' không tồn tại hoặc đã được kích hoạt");
            }
            device.setUserDevice(user);
            device.setActiveDate(new Date(System.currentTimeMillis()));
        });
        if ((boolean) response.get("hasError") == false){
            deviceRepository.saveAll(devices);
        }
        response.put("message", messages);
        return response.toString();
    }

    public void unactiveDevice(String deviceID){
        Device device = deviceRepository.getDeviceById(deviceID);

        device.setDescription(null);
        device.setName(null);
        device.setUserDevice(null);
        device.setActiveDate(null);
        device.setImageUrl("");
        deviceRepository.save(device);
    }

    public void updateDevice(Device updDevice, User user){
        Device device = deviceRepository.getDeviceById(updDevice.getId());

        device.setDescription(updDevice.getDescription());
        device.setName(updDevice.getName());
        device.setImageUrl(updDevice.getImageUrl());
        if (user.getUserDevices().contains(device) == false){
            return;
        }
        deviceRepository.save(device);
    }
    public List<Device> findByNameContainKey(String key, User user){
        return deviceRepository.findByNameContainingAndUserDevice(key, user);
    }

    public List<Device> getAllByUser(User user){
        return deviceRepository.getAllByUserDevice(user);
    }
}
