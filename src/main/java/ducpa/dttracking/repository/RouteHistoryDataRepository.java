package ducpa.dttracking.repository;

import ducpa.dttracking.entity.RouteHistory;
import ducpa.dttracking.entity.RouteHistoryData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.TypedQuery;

public interface RouteHistoryDataRepository extends JpaRepository<RouteHistoryData, Long> {
    RouteHistoryData findTopByRouteHistoryOrderByIdDesc(RouteHistory routeHistory);
}