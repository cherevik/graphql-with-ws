package aq.ws.services;

import aq.ws.model.Message;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {
    private final Sinks.Many<Message> sink;
    private final List<Message> messages = new ArrayList<Message>();

    public MessageService() {
        this.sink = Sinks.many().multicast().onBackpressureBuffer();
    }

    public void publish(final Message message) {
        sink.tryEmitNext(message);
    }

    public Flux<Message> getPublisher() {
        return sink.asFlux();
    }

    public List<Message> getAllMessages() {
        return messages;
    }

    public void addMessage(Message message) {
        messages.add(message);
        this.publish(message);
    }
}
