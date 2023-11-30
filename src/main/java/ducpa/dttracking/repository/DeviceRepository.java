package ducpa.dttracking.repository;

import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    Device getDeviceById(String id);

    List<Device> findByNameContainingAndUserDevice(String key, User user);

    List<Device> getAllByUserDevice(User user);

    Device findByUserDeviceAndId(User user, String id);

}
