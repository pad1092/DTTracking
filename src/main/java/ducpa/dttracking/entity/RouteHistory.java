package ducpa.dttracking.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Table(name = "route_history")
public class RouteHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    @OneToMany(mappedBy = "routeHistory", cascade = {CascadeType.ALL}, fetch = FetchType.LAZY)
    private List<RouteHistoryData> routeHistoryData;
}
