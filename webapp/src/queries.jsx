import {gql} from "@apollo/client";

export const MESSAGES_QUERY = gql`{
    allMessages {
        id
        role
        content
    }
}`;

export const POST_MESSAGE = gql`
    mutation postMessage($role: String, $content: String) {
        postMessage(role: $role, content: $content) {
            id
            role
            content
        }
    }
`;