package ducpa.dttracking.service;

import ducpa.dttracking.entity.Alert;
import ducpa.dttracking.entity.Device;
import ducpa.dttracking.entity.DeviceAlert;
import ducpa.dttracking.util.ScheduledTask;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Service
public class SchedulerService {
    @Autowired
    private Scheduler scheduler;
    @Autowired
    private DeviceService deviceService;

    public void scheduleJob(Alert alert, List<String> devicesID, String userphone) throws SchedulerException {
        JobDetail jobDetail = buildJobDetail(alert, devicesID, userphone);
        Trigger trigger = buildJobTrigger(alert, jobDetail);

        scheduler.scheduleJob(jobDetail, trigger);
    }

    private JobDetail buildJobDetail(Alert alert, List<String> devicesID, String userphone) {
        // Create a job with the necessary details based on user input
        return JobBuilder.newJob(ScheduledTask.class)
                .withIdentity(Double.toString(Math.random()))
                .usingJobData("longitue", alert.getLongitude())
                .usingJobData("latitude", alert.getLatitude())
                .usingJobData("range", alert.getRange())
                .usingJobData("devicesID", String.join(",", devicesID))
                .usingJobData("userphone", userphone)
                .build();
    }

    private Trigger buildJobTrigger(Alert alert, JobDetail jobDetail) {
        // Create a trigger based on user input and job details
        TriggerBuilder<Trigger> triggerBuilder = TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(Double.toString(Math.random()));

        switch (alert.getSchedular()) {
            case "everyday":
                return triggerBuilder.withSchedule(CronScheduleBuilder.cronSchedule(calculateCronExpressionForMinuteInterval(alert.getStartTime(), alert.getEndTime(), 1))).build();
            case "2to6":
                return triggerBuilder.withSchedule(CronScheduleBuilder.cronSchedule(calculateCronExpressionForHourlyInterval(alert.getStartTime(), alert.getEndTime(), 2, 6, DateBuilder.MONDAY, DateBuilder.FRIDAY))).build();
            case "7to8":
                return triggerBuilder.withSchedule(CronScheduleBuilder.cronSchedule(calculateCronExpressionForHourlyInterval(alert.getStartTime(), alert.getEndTime(), 7, 8, DateBuilder.SATURDAY, DateBuilder.SUNDAY))).build();
            case "onece":
                return triggerBuilder.withSchedule(CronScheduleBuilder.cronSchedule(calculateCronExpressionForOnce(alert.getStartTime(), alert.getEndTime()))).build();
            default:
                throw new IllegalArgumentException("Invalid repeat frequency");
        }
    }

    private String calculateCronExpressionForMinuteInterval(Time startTime, Time endTime, int interval) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("ss mm HH");
        String cronExpressionTemplate = "%d/%d %s-%s * * ?";

        String startCronTime = dateFormat.format(startTime);
        String endCronTime = dateFormat.format(endTime);

        return String.format(cronExpressionTemplate, 0, interval, startCronTime, endCronTime);
    }

    private String calculateCronExpressionForHourlyInterval(Time startTime, Time endTime, int startHour, int endHour, int... daysOfWeek) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("ss mm HH");
        String cronExpressionTemplate = "%s %s-%s/%s %s * ?";

        String startCronTime = dateFormat.format(startTime);
        String endCronTime = dateFormat.format(endTime);

        return String.format(cronExpressionTemplate, 0, startCronTime, endCronTime, startHour, endHour, String.join(",", convertToDayOfWeekStrings(daysOfWeek)));
    }

    private String calculateCronExpressionForOnce(Time startTime, Time endTime) {
        int startMinute = startTime.getMinutes();
        int endMinute = endTime.getMinutes();

        String cronExpression = "0 " + startMinute + "/" + (endMinute - startMinute) + " " + startTime.getHours() + " * * ?";

        return cronExpression;
    }

    private String[] convertToDayOfWeekStrings(int[] daysOfWeek) {
        String[] dayOfWeekStrings = new String[daysOfWeek.length];
        for (int i = 0; i < daysOfWeek.length; i++) {
            dayOfWeekStrings[i] = String.valueOf(daysOfWeek[i]);
        }
        return dayOfWeekStrings;
    }

//    public static class MyJob implements Job {
//        @Override
//        public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
//            System.out.println("Job is running...");
//        }
//    }
}
