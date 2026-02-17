package com.logick;

import com.logick.auth.AuthManager;
import com.logick.buffer.LogBuffer;
import com.logick.model.LogEvent;
import com.logick.config.LogicKConfig;
import com.logick.sender.LogSender;
import com.logick.integration.LogickAppender;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.config.Configuration;

public class LogicK {

    public static void init(String clientId, String clientSecret) {
        LogicKConfig.CLIENT_ID = clientId;
        LogicKConfig.CLIENT_SECRET = clientSecret;

        // Authenticate immediately
        AuthManager.authenticate();

        // 👇 FORCE LogSender to start scheduler
        LogSender.start();
        attachAppender();

        System.out.println("LogiK initialized successfully");
    }
    private static void attachAppender() {
        LoggerContext context = (LoggerContext) LogManager.getContext(false);
        Configuration config = context.getConfiguration();

        LogickAppender appender =
                (LogickAppender) LogickAppender.createAppender();

        appender.start();
        config.addAppender(appender);

        config.getRootLogger().addAppender(appender, null, null);

        context.updateLoggers();
    }

    public static void log(String message) {
        LogBuffer.add(
                new LogEvent(message, System.currentTimeMillis())
        );
    }
}
