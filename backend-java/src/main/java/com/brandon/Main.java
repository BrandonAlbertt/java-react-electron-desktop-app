package com.brandon;

import io.javalin.Javalin;

import java.time.LocalDateTime;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(rule -> {
                    rule.anyHost();
                });
            });
        }).start(8080);

        app.get("/", ctx -> {
            ctx.result("Backend Java funcionando");
        });

        app.get("/favicon.ico", ctx -> {
            ctx.status(204);
        });

        app.get("/api/saludo", ctx -> {
            ctx.json(Map.of(
                    "mensaje", "Hola desde el backend Java",
                    "estado", "ok",
                    "hora", LocalDateTime.now().toString()));
        }); 
    }
}