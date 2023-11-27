package ducpa.dttracking.service;

import ducpa.dttracking.util.entity.User;
import ducpa.dttracking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class UtilService {
    @Autowired
    private UserRepository userRepository;
    public User getUserByRequest(Authentication authentication){
        String username = authentication.getName();
        User user = userRepository.findByPhone(username);
        return user;
    }
}
