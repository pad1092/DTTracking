package ducpa.dttracking.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import javax.annotation.PostConstruct;

@Component
public class TeleBotSenPhoto extends TelegramLongPollingBot {
    @Override
    public String getBotUsername() {
        return "DT Tracking";
    }

    @Override
    public String getBotToken() {
        return "6734966765:AAE5xHBrXuaknxeSGBJEh2WOM6DzAARwKMk";
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.getMessage() != null){
            System.out.println(update.getMessage().getChatId());
        }
    }
    public void sendMessage(String message){
        SendMessage sendMessage = new SendMessage();
        sendMessage.setText(message);
        sendMessage.setChatId("1450044185");
        try {
            execute(sendMessage);
        } catch (NullPointerException e) {
            e.printStackTrace();
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}
