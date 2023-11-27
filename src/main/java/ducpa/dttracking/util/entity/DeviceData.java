package ducpa.dttracking.util.entity;

import lombok.*;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
@Table (name = "device_data")
public class DeviceData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double longitude;
    private double latitude;
    private double speed;
    private String time;
    private String deviceId;
}
