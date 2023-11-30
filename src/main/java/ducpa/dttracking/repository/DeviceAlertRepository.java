package ducpa.dttracking.repository;

import ducpa.dttracking.entity.DeviceAlert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceAlertRepository extends JpaRepository<DeviceAlert, Long> {
}