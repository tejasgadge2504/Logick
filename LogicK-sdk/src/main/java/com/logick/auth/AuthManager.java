package com.logick.auth;

import com.google.gson.Gson;
import com.logick.config.LogicKConfig;

import java.net.URI;
import java.net.http.*;
import java.time.Instant;
import java.util.Map;

public class AuthManager {

    private static Instant tokenExpiry;

    public static void authenticate() {
        try {
            HttpClient client = HttpClient.newHttpClient();

            String body = new Gson().toJson(Map.of(
                    "clientId", LogicKConfig.CLIENT_ID,
                    "clientSecret", LogicKConfig.CLIENT_SECRET
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(LogicKConfig.BASE_URL + "/api/auth/client-auth"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            Map res = new Gson().fromJson(response.body(), Map.class);

            LogicKConfig.TOKEN = (String)((Map)res.get("data")).get("token");
            tokenExpiry = Instant.now().plusSeconds(86400);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static boolean isTokenExpired() {
        return tokenExpiry == null || Instant.now().isAfter(tokenExpiry.minusSeconds(60));
    }
}
