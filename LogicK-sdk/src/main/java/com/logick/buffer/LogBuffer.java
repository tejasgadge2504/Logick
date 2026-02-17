package com.logick.buffer;

import com.logick.model.LogEvent;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

public class LogBuffer {

    private static final Queue<LogEvent> BUFFER =
            new ConcurrentLinkedQueue<>();

    public static void add(LogEvent event) {
        BUFFER.add(event);
    }

    public static List<LogEvent> drain(int max) {
        List<LogEvent> batch = new ArrayList<>();
        while (!BUFFER.isEmpty() && batch.size() < max) {
            batch.add(BUFFER.poll());
        }
        return batch;
    }
}
