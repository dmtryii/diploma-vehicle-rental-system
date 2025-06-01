package com.dmtryii.backend.sse;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class LogSseAppender extends AppenderBase<ILoggingEvent> {

    public static final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public static void addEmitter(SseEmitter emitter) {
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitters.add(emitter);
    }

    @Override
    protected void append(ILoggingEvent event) {
        String msg = event.getFormattedMessage();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().data(msg));
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        }
    }
}
