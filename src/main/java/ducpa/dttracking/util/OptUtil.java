package ducpa.dttracking.util;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.concurrent.TimeUnit;
@Component
public class OptUtil {
    private static final int EXPIRE_MINS = 5;
    private LoadingCache<String, String> otpCache;
    public OptUtil() {
        otpCache = CacheBuilder.newBuilder()
                .expireAfterWrite(EXPIRE_MINS, TimeUnit.MINUTES)
                .build(new CacheLoader<>() {
                    public String load(String key) {
                        return generateOtp();
                    }
                });
    }
    public String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public String getOtp(String key) {
        return otpCache.getUnchecked(key);
    }

    public void clearOtp(String key) {
        otpCache.invalidate(key);
    }
    public boolean validateOtp(String email, String opt){
        return getOtp(email) != null && getOtp(email).equalsIgnoreCase(opt);
    }

}
