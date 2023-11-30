package ducpa.dttracking.util;

import ducpa.dttracking.DtTrackingApplication;
import org.json.JSONObject;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTask implements Job {
    @Autowired
    private TeleBotSenPhoto teleBot;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        if (this.teleBot == null){
            this.teleBot = new TeleBotSenPhoto();
        }
        JobDataMap jobDataMap = context.getMergedJobDataMap();

        // Retrieve start time, end time, or any other necessary data from job data map
        int range = (int) jobDataMap.getInt("range");
        Double latitude = jobDataMap.getDouble("latitude");
        Double longitude = jobDataMap.getDouble("longitue");
        String devicesID = jobDataMap.getString("devicesID");
        System.out.println(range + " " + latitude + " " + longitude + " " + jobDataMap.getString("devicesID"));
        for (String deviceID : devicesID.split(",")){
            if (DtTrackingApplication.devicePlaceData.get(deviceID) == null){
                String message = "CẢNH BÁO \n Thiết bị '" + deviceID + "' hiện không có tín hiệu";
                teleBot.sendMessage(message);
            }
            else {
                JSONObject data = DtTrackingApplication.devicePlaceData.get(deviceID);
                Double currLat = data.getDouble("latitude");
                Double currLong = data.getDouble("longitude");
                if (isWithinRange(latitude, longitude, currLat, currLong, range) == false){
                    StringBuilder stringBuilder = new StringBuilder();
                    stringBuilder.append("CẢNH BÁO");
                    stringBuilder.append("Thiết bị '" + deviceID + "' ra khỏi phạm vi cho trước");
                    stringBuilder.append("Vị ví hiện tại của thiết bị: https://www.google.com/maps/place/" + latitude + "," + longitude);
                    teleBot.sendMessage(stringBuilder.toString());
                }
            }
        }
        // Perform the task based on the user input
        // ...
    }

    private  boolean isWithinRange(double lat, double lon, double currLat, double currLon, int range) {
        double distance = calculateDistance(lat, lon, currLat, currLon);
        System.out.println("DISTANCE: " + distance);
        return distance <= range;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula to calculate distance between two sets of coordinates
        double R = 6371; // Earth radius in kilometers

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}