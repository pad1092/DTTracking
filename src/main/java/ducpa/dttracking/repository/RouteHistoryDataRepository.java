package ducpa.dttracking.repository;

import ducpa.dttracking.entity.RouteHistoryData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteHistoryDataRepository extends JpaRepository<RouteHistoryData, Long> {
}