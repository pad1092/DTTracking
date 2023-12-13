package ducpa.dttracking.util;

import ducpa.dttracking.entity.RouteHistoryData;

public class NmeaParser {
    public static RouteHistoryData parser(String message) {
        try{
            RouteHistoryData routeHistoryData = new RouteHistoryData();
            String[] parts = message.split(",");
            String time = parts[1];
            String status = parts[2];
            String latitude = parts[3];
            String latDirection = parts[4];
            String longitude = parts[5];
            String lonDirection = parts[6];
            String speedKnots = parts[7];
            double latDouble = convertToDecimal(latitude, latDirection);
            double lonDouble = convertToDecimal(longitude, lonDirection);
            double speedKmH = Double.parseDouble(speedKnots) * 1.852D;
            routeHistoryData.setTime(time);
            routeHistoryData.setSpeed(Double.valueOf(speedKmH));
            routeHistoryData.setLongitude(Double.valueOf(lonDouble));
            routeHistoryData.setLatitude(Double.valueOf(latDouble));
            return routeHistoryData;
        } catch (Exception ex){
            return null;
        }
    }

    private static double convertToDecimal(String coordinate, String direction) {
        double coordinateDouble = Double.parseDouble(coordinate);
        double value = Math.floor(coordinateDouble / 100.0D) + coordinateDouble % 100.0D / 60.0D;
        if ("S".equals(direction) || "W".equals(direction))
            value = -value;
        return value;
    }
}

