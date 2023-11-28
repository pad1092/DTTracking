package ducpa.dttracking.repository;

import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.RouteHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.util.List;

public interface RouteHistoryRepository extends JpaRepository<RouteHistory, Long> {
    List<RouteHistory> findAllByDeviceAndDate(Device device, Date date);
}