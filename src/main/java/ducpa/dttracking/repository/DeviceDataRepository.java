package ducpa.dttracking.repository;

import ducpa.dttracking.util.entity.DeviceData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceDataRepository extends JpaRepository<DeviceData, Long> {
}
