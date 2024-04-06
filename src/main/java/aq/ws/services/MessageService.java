package aq.ws.services;

import aq.ws.model.Message;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {
    private final List<Message> messages = new ArrayList<Message>();

    public List<Message> getAllMessages() {
        return messages;
    }

    public void addMessage(Message message) {
        messages.add(message);
    }
}
