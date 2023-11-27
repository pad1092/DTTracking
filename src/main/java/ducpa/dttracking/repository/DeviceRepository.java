package ducpa.dttracking.repository;

import ducpa.dttracking.util.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    Device getDeviceById(String id);
}
