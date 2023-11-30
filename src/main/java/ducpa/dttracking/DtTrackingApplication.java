package ducpa.dttracking;

import ducpa.dttracking.util.TeleBotSenPhoto;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class DtTrackingApplication {
    public static Map<String, JSONObject> devicePlaceData;
    public static void main(String[] args) {
        SpringApplication.run(DtTrackingApplication.class, args);
        devicePlaceData = new HashMap<>();

        try {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            botsApi.registerBot(new TeleBotSenPhoto());
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }

    }

}
