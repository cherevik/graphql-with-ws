import {useEffect, useState} from 'react'
import './App.css'
import {Box, Grid, IconButton, InputAdornment, List, ListItem, TextField, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {GraphQLProvider} from "./GraphQLProvider.jsx";
import {useMutation, useQuery} from "@apollo/client";
import {MESSAGES_QUERY, NEW_MESSAGE_SUBSCRIPTION, POST_MESSAGE} from "./queries.jsx";


const InputBox = () => {
    const [value, setValue] = useState('');
    const [postMessage] = useMutation(POST_MESSAGE);

    const handleInputChange = (event) => {
        setValue(event.target.value);
    };

    const handleSend = () => {
        postMessage({
            variables: {
                role: "USER",
                content: value
            }
        }).catch(error => console.log(error));
        setValue('');
    };

    return (
        <TextField
            variant="outlined"
            fullWidth={true}
            sx={{mb: 2}}
            value={value}
            onChange={handleInputChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleSend}>
                            <SendIcon/>
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
}


const MessageList = () => {
    const {error, loading, data, subscribeToMore} = useQuery(MESSAGES_QUERY);

    useEffect(() => {
        subscribeToMore({
            document: NEW_MESSAGE_SUBSCRIPTION,
            variables: {},
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;
                const newMessage = subscriptionData.data.newMessage;
                const allMessages = prev.allMessages
                    .filter(message => message.id !== newMessage.id);
                allMessages.push(newMessage);
                return Object.assign({}, prev, {allMessages:allMessages});
            }
        });
    }, [subscribeToMore])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <List>
            {data.allMessages.map(message => {
                return (<ListItem key={message.id}>
                    <Typography>{message.content}</Typography>
                </ListItem>)
            })}
        </List>
    );
};

function App() {

    return (
        <GraphQLProvider>
            <Grid container spacing={0} sx={{maxWidth: '960px', margin: 'auto', height: "100%"}}>
                <Grid item xs={12} sx={{display: "flex", flexDirection: "column", height: "100%"}}>
                    <Box sx={{flexGrow: 1}}>
                        <MessageList/>
                    </Box>
                    <Box>
                        <InputBox/>
                    </Box>
                </Grid>
            </Grid>
        </GraphQLProvider>
    )
}

export default App
