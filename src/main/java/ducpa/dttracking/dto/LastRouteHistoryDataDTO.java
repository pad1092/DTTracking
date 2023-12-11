package ducpa.dttracking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LastRouteHistoryDataDTO {
    private Double longitude;
    private Double latitude;
    private String time;
}
