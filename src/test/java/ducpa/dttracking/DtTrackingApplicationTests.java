package ducpa.dttracking;

import ducpa.dttracking.service.RouteHistoryDataService;
import ducpa.dttracking.service.RouteHistoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;

@SpringBootTest
class DtTrackingApplicationTests {
    @Autowired
    private RouteHistoryService service;
    @Test
    void contextLoads() {
    }
    @Test
    @Transactional
    void testDD(){
    }
}
