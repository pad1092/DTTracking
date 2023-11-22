package ducpa.dttracking.config.mosquitto;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.handler.annotation.Header;

@MessagingGateway(defaultRequestChannel = "mqttOutboundChannel")
public interface MqttGateway {
    void sendToBrokerServer(String message, @Header(MqttHeaders.TOPIC) String topic);
}
