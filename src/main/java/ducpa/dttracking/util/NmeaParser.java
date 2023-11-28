package ducpa.dttracking.util;

import ducpa.dttracking.entity.DeviceData;

public class NmeaParser {
    public static DeviceData parser(String message){
        DeviceData deviceData = new DeviceData();

        String[] parts = message.split(",");
        String time = parts[1];
        String status = parts[2];
        String latitude = parts[3];
        String latDirection = parts[4];
        String longitude = parts[5];
        String lonDirection = parts[6];
        String speedKnots = parts[7];

        if (status.equals("V")){ // invalid data
            return null;
        }

        double latDouble = convertToDecimal(latitude, latDirection);
        double lonDouble = convertToDecimal(longitude, lonDirection);
        double speedKmH = Double.parseDouble(speedKnots) * 1.852; // 1 knot = 1.852 km/h

        deviceData.setTime(time);
        deviceData.setSpeed(speedKmH);
        deviceData.setLongitude(lonDouble);
        deviceData.setLatitude(latDouble);

        return deviceData;
    }
    private static double convertToDecimal(String coordinate, String direction) {
//        double value = Double.parseDouble(coordinate.substring(0, 2)) + Double.parseDouble(coordinate.substring(2)) / 60.0;
        double coordinateDouble = Double.parseDouble(coordinate);

        double value = Math.floor(coordinateDouble/100) + (coordinateDouble % 100)/60;

        if ("S".equals(direction) || "W".equals(direction)) {
            value = -value;
        }
        return value;
    }
}
