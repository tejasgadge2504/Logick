package com.logick.integration;

import com.logick.LogicK;
import org.apache.logging.log4j.core.Appender;
import org.apache.logging.log4j.core.Layout;
import org.apache.logging.log4j.core.LogEvent;
import org.apache.logging.log4j.core.appender.AbstractAppender;

import java.io.Serializable;

public class LogickAppender extends AbstractAppender {

    protected LogickAppender(String name, Layout<? extends Serializable> layout) {
        super(name, null, layout, false);
    }

    @Override
    public void append(LogEvent event) {
        String message = event.getMessage().getFormattedMessage();

        // Send to Logick SDK
        LogicK.log(message);
    }

    public static Appender createAppender() {
        return new LogickAppender("LogickAppender", null);
    }
}
