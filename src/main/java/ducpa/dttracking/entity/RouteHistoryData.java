package ducpa.dttracking.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Table(name = "route_history_data")
public class RouteHistoryData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double latitude;
    private Double longitude;
    private Double speed;
    private String time;

    @ManyToOne
    @JoinColumn(name = "route_history_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private RouteHistory routeHistory;
}
