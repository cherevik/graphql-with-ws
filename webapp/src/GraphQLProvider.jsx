import {ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, split, from} from '@apollo/client';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import {useEffect, useState} from "react";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {getMainDefinition} from "@apollo/client/utilities";

export function GraphQLProvider({ children }) {
    const [link, setLink] = useState(null);
    const token = 'Blah'
    const wsUrl = 'ws://localhost:8080/graphql';
    const apiUrl = 'http://localhost:8080'

    useEffect(() => {
        if (token && apiUrl && wsUrl) {
            const wsLink = new GraphQLWsLink(createClient({
                url: wsUrl,
                connectionParams: () => ({
                    headers: {
                        'X-Authorization': `Bearer ${token}`, // Replace YOUR_AUTH_TOKEN with your actual token
                    },
                }),
            }));

            const httpLink = createHttpLink({
                uri: `${apiUrl}/graphql`,
            });
            const authLink = setContext((_, { headers }) => {
                return {
                    headers: {
                        ...headers,
                        authorization: token ? `Bearer ${token}` : "",
                    }
                }
            });
            const httpLinkWithAuthToken = authLink.concat(httpLink);

            const splitLink = split(
                ({ query }) => {
                    const definition = getMainDefinition(query);
                    return (
                        definition.kind === 'OperationDefinition' &&
                        definition.operation === 'subscription'
                    );
                },
                wsLink, // WebSocket link for subscriptions
                httpLinkWithAuthToken, // HTTP link for queries and mutations, with auth token
            );

            setLink(from([splitLink]));
        }
    }, [token, apiUrl, wsUrl]);

    const client = new ApolloClient({
        link: link,
        cache: new InMemoryCache(),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

