package ducpa.dttracking.util.entity;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
@Table(name = "usertbl")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String phone;
    private String password;
    private String fullname;
    private String email;
    private String role;

    @OneToMany(mappedBy = "userDevice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Device> userDevices;
}
