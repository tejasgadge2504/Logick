package com.logick.sender;

import com.google.gson.Gson;
import com.logick.auth.AuthManager;
import com.logick.buffer.LogBuffer;
import com.logick.config.LogicKConfig;
import com.logick.model.LogEvent;

import java.net.URI;
import java.net.http.*;
import java.util.List;
import java.util.concurrent.*;

public class LogSender {

    private static final ScheduledExecutorService scheduler =
            Executors.newSingleThreadScheduledExecutor();

    private static boolean started = false;

    public static void start() {
        if (started) return;
        started = true;

        scheduler.scheduleAtFixedRate(() -> {
            try {

                if (AuthManager.isTokenExpired()) {
                    AuthManager.authenticate();
                }

                List<LogEvent> logs = LogBuffer.drain(50);

                if (logs.isEmpty()) return;

                sendAsync(logs);

            } catch (Exception e) {
                e.printStackTrace();
            }

        }, 5, 10, TimeUnit.SECONDS);
    }

    private static void sendAsync(List<LogEvent> logs) {
        try {

            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(LogicKConfig.BASE_URL + "/api/logs/ingest"))
                    .header("Authorization", "Bearer " + LogicKConfig.TOKEN)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(
                            new Gson().toJson(logs)))
                    .build();

            client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response ->
                            System.out.println("Logs sent: " + response.statusCode())
                    )
                    .exceptionally(e -> {
                        e.printStackTrace();
                        return null;
                    });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
