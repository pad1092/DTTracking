package ducpa.dttracking.repository;

import ducpa.dttracking.entity.DangerZone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DangerZoneRepository extends JpaRepository<DangerZone, Long> {
    public DangerZone getById(Long id);
    void deleteById(Long id);
}
