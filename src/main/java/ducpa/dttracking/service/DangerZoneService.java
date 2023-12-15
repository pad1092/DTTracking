package ducpa.dttracking.service;

import ducpa.dttracking.entity.DangerZone;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.DangerZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class DangerZoneService{
    @Autowired
    private DangerZoneRepository dangerZoneRepository;

    public void addNewDangerZone(DangerZone dangerZone){
        System.out.println(dangerZone);
        dangerZoneRepository.save(dangerZone);
    }

    public void deleteDangerZone(User user, Long dangerZoneId){
        DangerZone dangerZone = dangerZoneRepository.getById(dangerZoneId);
        if (user.getDangerZones().contains(dangerZone) == true){
            user.getDangerZones().remove(dangerZone);
            dangerZoneRepository.delete(dangerZone);
        }
    }
}
