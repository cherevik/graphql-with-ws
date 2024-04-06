package aq.ws.controller;

import aq.ws.model.Message;
import aq.ws.services.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Slf4j
@Controller
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @QueryMapping
    public List<Message> allMessages() {
        return messageService.getAllMessages();
    }

    @MutationMapping
    public Message postMessage(@Argument String role, @Argument String content) {
        Message message = Message.builder()
                .id(UUID.randomUUID().toString())
                .role(role)
                .content(content)
                .build();
        messageService.addMessage(message);
        return message;
    }
}
