package com.dmtryii.backend.sse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class LogBroadcaster {

    private static final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public static void register(SseEmitter emitter) {
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
    }

    public static void broadcast(String logMessage) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().data(logMessage));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}
