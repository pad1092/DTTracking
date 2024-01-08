package ducpa.dttracking.service;

import ducpa.dttracking.entity.Alert;
import ducpa.dttracking.entity.User;
import ducpa.dttracking.repository.AlertRepository;
import ducpa.dttracking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlertService {
    @Autowired
    private AlertRepository alertRepository;
    @Autowired
    private UserRepository userRepository;
    public void addNewAlert(Alert alert){
        alertRepository.save(alert);
    }

    public void deleteAlert(User user, Long alertID){
        Alert alert = alertRepository.getById(alertID);
        user.setAlerts(null);
        userRepository.save(user);
        alert.setUser(null);
        alertRepository.delete(alert);
    }
}
