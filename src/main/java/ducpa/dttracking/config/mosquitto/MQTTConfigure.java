package ducpa.dttracking.config.mosquitto;

import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Configuration
public class MQTTConfigure {
    @Value("${mosquitto.url}")
    private String mqttUrl;
    @Value("${mosquitto.authen.username}")
    private String username;
    @Value("${mosquitto.authen.password}")
    private String password;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @Bean
    public MqttPahoClientFactory mqttClientFactory(){
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{mqttUrl});
        options.setCleanSession(true);
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        factory.setConnectionOptions(options);

        return factory;
    }

    @Bean
    public MessageChannel mqttInputChanel() {
        return new DirectChannel();
    }
    @Bean
    MessageProducer inbound(){
        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter("serverIn",
                                                            mqttClientFactory(), "#");
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(2);
        adapter.setOutputChannel(mqttInputChanel());
        return adapter;
    }
    @Bean
    @ServiceActivator(inputChannel = "mqttInputChanel")
    public MessageHandler handler(){
        return new MessageHandler() {
            @Override
            public void handleMessage(Message<?> message) throws MessagingException {
                String topic = message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC).toString();
                String destination = "/device/" + topic;
                simpMessagingTemplate.convertAndSend(destination, message.getPayload());
                System.out.println(message.getPayload() + " - " +topic);
            }
        };
    }

    @Bean
    public MessageChannel mqttOutboundChannel(){
        return new DirectChannel();
    }
    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannel")
    public MessageHandler mqttOutbound(){
        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler("serverOut", mqttClientFactory());
        messageHandler.setAsync(true);
        messageHandler.setDefaultTopic("#");
        return messageHandler;
    }
}


