import React, { useState, Component, useEffect, useRef } from "react";
import styled from 'styled-components'
import RaisedButton from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FloatingActionButton from '@material-ui/core/Button';
import FontIcon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography, Theme, makeStyles, createStyles } from "@material-ui/core";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import SendIcon from '@material-ui/icons/Send';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { animateScroll } from "react-scroll";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: '36ch',
            backgroundColor: theme.palette.background.paper,
        },
        inline: {
            display: 'inline',
        },
        searchFieldRight: {
            display: "inline-block",
            width: "100%",
        }
    }),
);



const Chatroom: React.FC = (props: any) => {
    const classes = useStyles();
    const [useOnce, setUseOnce] = useState(true);
    const [state, setState] = useState(props.children);
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState<any>(props.children.chatHistory);
    const [group, setGroup] = React.useState<string | null>('');

    const scrollToBottom = () => {
        animateScroll.scrollToBottom({
            containerId: `messageListId${state.type }`
        });
    }

    useEffect(() => {
        scrollToBottom()
        if (useOnce) {
            state.registerHandler(onMessageReceived);
            setUseOnce(false);
        }
    })

    const onInput = (e: any) => {
        setInput(e.target.value)
    }
    const onSendMessage = () => {
        if (!input)
            return
        state.onSendMessage({ content: input, type: state.gameRole, group: "" }, (err) => {
            if (err)
                return console.error(err)
            return setInput("")
        })
    }

    const onMessageReceived = (entry) => {
        updateChatHistory(entry)
    }

    const updateChatHistory = (entry) => {
        if (entry.message && entry.message.type === "end") {
            if (state.gameRole === "player")
                state.onLeave()
        } else {
            chatHistory.push(entry);
            let updatedChatHistory =
                chatHistory.filter((elem) => {
                    if (state.type === "hint") {
                        return true;
                    } else {
                        if (state.gameRole === "player") {
                            return elem.message.type === "storyteller";
                        } else {
                            return elem.message.type === "player";
                        }
                    }
                })
            setChatHistory([...updatedChatHistory]);
        }
    }

    const handleGroup = (group, item, index) => {
        if (state.gameRole === "storyteller") {
            setGroup(group);
            let chatHistoryCopy = JSON.parse(JSON.stringify(chatHistory))
            chatHistory[index].message.group = group;
            console.log(index, chatHistory)
            setChatHistory([...chatHistory]);
            state.onSendMessage({ content: item.message.content, type: state.gameRole, group: group }, (err) => {
                if (err)
                    return console.error(err)
                return setInput("")
            })
        }
    };

    return (
        <Container fluid>
            <Row xs={12} md={12} lg={12} style={{ padding: "0px 20px 20px 20px" }}>
                <Card className="text-center" style={{ width: "100%", background: "rgba(222, 222, 222, 0.32)", color: "white" }}>
                    <Card.Header style={{ fontWeight: "bold" }}>{state.title}</Card.Header>
                    <Card.Body id={`messageListId${state.type }`} style={state.type === "hint" ? { maxHeight: "10rem", overflowY: "auto" } : { maxHeight: "20rem", overflowY: "auto" }}>
                        {chatHistory.map(
                            (item, index) => ((item.chat === state.chatroom) &&
                                (<Row xs={10} md={10} lg={10}>
                                    <Card style={{ width: "100%", margin: "2px 0px 2px 0px", background: "#04030385" }}>
                                        <Card.Body style={{ padding: "0.25rem 1.25rem 0.25rem 1.25rem" }}>
                                            <Row>
                                                <Col xs={12} md={3} lg={2} style={{ margin: "auto" }}>
                                                    <Avatar style={{ width: "45px", float: "left" }}>
                                                        <span>{item.user.lastName.substring(0, 1)}</span>
                                                    </Avatar>
                                                    <span>{`${item.user.lastName} ${item.user.firstName}`}</span>
                                                </Col>
                                                {state.type != "story" && (<Col xs={12} md={9} lg={10} style={{ margin: "auto" }}>
                                                    <span>{item.message.content}</span>
                                                </Col>)}
                                                {state.type == "story" && (<Col xs={12} md={9} lg={7} style={{ margin: "auto" }}>
                                                    <span>{item.message.content}</span>
                                                </Col>)}
                                                {state.type == "story" && (<Col xs={12} md={12} lg={3} style={{ margin: "auto" }}>

                                                    <ToggleButtonGroup
                                                        value={item.message.group}
                                                        exclusive
                                                        onChange={(e: any, group) => { handleGroup(group, item, index) }}
                                                        aria-label="text alignment"
                                                    >
                                                        <ToggleButton
                                                            value="yes"
                                                            aria-label="left aligned"
                                                            style={(item.message.group === "yes") ? { backgroundColor: "#88d25a", color: "white", fontWeight: "bold" } : {}}
                                                        >
                                                            <span>Yes</span>
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value="no"
                                                            aria-label="centered"
                                                            style={(item.message.group === "no") ? { backgroundColor: "#ff4a21", color: "white", fontWeight: "bold" } : {}}
                                                        >
                                                            <span>No</span>
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value="unrelated"
                                                            aria-label="right aligned"
                                                            style={(item.message.group === "unrelated") ? { backgroundColor: "#f3a42e", color: "white", fontWeight: "bold" } : {}}
                                                        >
                                                            <span>Unrelated</span>
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                </Col>)}
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Row>)
                            ))}

                    </Card.Body>
                    <Card.Footer className="text-muted">
                        {(state.gameRole == "player" || state.type == "hint") &&
                            (<TextField
                                style={{ backgroundColor: "white" }}
                                fullWidth
                                id="send"
                                type="text"
                                label="Send a message"
                                margin="normal"
                                variant="outlined"
                                value={input}
                                onKeyPress={e => (e.key === 'Enter' ? onSendMessage() : null)}
                                onChange={onInput}
                                InputProps={{
                                    endAdornment:
                                        <Button style={{ width: "100px" }} variant="primary"
                                            onClick={onSendMessage}
                                        ><SendIcon />Send</Button>
                                }}
                                className={classes.searchFieldRight}
                            />)}
                    </Card.Footer>
                </Card>
            </Row>
        </Container>
    )
}

export default Chatroom;