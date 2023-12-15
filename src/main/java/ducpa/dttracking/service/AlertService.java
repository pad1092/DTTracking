package ducpa.dttracking.service;

import ducpa.dttracking.entity.Alert;
import ducpa.dttracking.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlertService {
    @Autowired
    private AlertRepository alertRepository;
    public void addNewAlert(Alert alert){
        alertRepository.save(alert);
    }
}
