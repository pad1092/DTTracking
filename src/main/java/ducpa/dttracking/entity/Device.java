package ducpa.dttracking.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Table(name = "device")
public class Device {
    @Id
    private String id;
    private String name;
    private String description;
    private Date activeDate;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private User userDevice;
}
