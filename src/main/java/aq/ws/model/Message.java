package aq.ws.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Message {
    String id;
    String role;
    String content;
}
