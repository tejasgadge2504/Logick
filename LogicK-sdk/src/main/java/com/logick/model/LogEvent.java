package com.logick.model;

public class LogEvent {
    public String logText;
    public long timestamp;

    public LogEvent(String logText, long timestamp) {
        this.logText = logText;
        this.timestamp = timestamp;
    }
}
