package ducpa.dttracking.repository;

import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByPhone(String phone);
    User findByEmail(String email);
    User findByEmailAndPhone(String email, String phone);
}
