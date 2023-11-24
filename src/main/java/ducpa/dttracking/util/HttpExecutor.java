package ducpa.dttracking.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class HttpExecutor {
    public static Object sendGetRequest(String url, String field){
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        try{
            JsonNode jsonNode = objectMapper.readTree(jsonResponse);
            return jsonNode.get(field).asText();
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
}
