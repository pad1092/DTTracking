package ducpa.dttracking.repository;

import ducpa.dttracking.entity.DeviceAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
public interface DeviceAlertRepository extends JpaRepository<DeviceAlert, Long> {
    List<DeviceAlert> getAllByDevice_Id(String deviceID);
}