package ducpa.dttracking.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Time;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Table(name = "device_alert")
public class DeviceAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "device_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Device device;

    @ManyToOne
    @JoinColumn(name = "alert_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Alert alert;
    private Time startTime;
    private int duration;
}
