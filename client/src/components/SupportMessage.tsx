import styles from "./SubmitQuestion.module.scss";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AuthenticationService from "../services/Authentication.service";
import CreateIcon from "@material-ui/icons/Create";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Switch from "@material-ui/core/Switch";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import environment from "../config/default";
import ReportIcon from '@material-ui/icons/Report';
import Axios from "axios";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 20,
    },
    subtitle: {
        fontSize: 12,
    },
    pos: {
        marginBottom: 12,
    },
});

const SupportMessage: React.FC = (props: any) => {
    const classes = useStyles();
    const [data, setData] = useState(props.children.data);
    const [answer, setAnswer] = useState(data.answer);
    const [isUser, setIsUser] = useState(
        AuthenticationService.currentUserValue.role == "user" ? true : false
    );
    const [isSupport, setIsSupport] = useState(
        AuthenticationService.currentUserValue.role == "support" ? true : false
    );
    const [isAdmin, setIsAdmin] = useState(
        AuthenticationService.currentUserValue.role == "admin" ? true : false
    );
    const [isImportant, setIsImportant] = React.useState(data.impFlag);

    const handleTextareaHeight = (value) => {
        return (value ? value.split("\n").length : 0) + 1;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsImportant(event.target.checked);
        axios
            .put(`${environment.apiUrl}/support-messages/imp-flag`,
                {
                    id: data._id,
                    impFlag: !isImportant
                },
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.token}`,
                    },
                })
            .then((res: any) => {
            })
            .catch((err) => console.log(err));
    };

    const handleSubmit = () => {
        axios
            .put(`${environment.apiUrl}/support-messages/answer`,
                {
                    id: data._id,
                    answer: answer
                },
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.token}`,
                    },
                })
            .then((res: any) => {
            })
            .catch((err) => console.log(err));
    };

    const handleDelete = () => {
        axios
            .delete(`${environment.apiUrl}/support-messages/${data._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.token}`,
                    },
                })
            .then((res: any) => {
                props.children.onFetchData();
            })
            .catch((err) => console.log(err));
    }

    const handleReport = (data) => {
        Axios
            .post(`${environment.apiUrl}/users/report`,
                {
                    id: "",
                    email: data.email
                },
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.token}`,
                    },
                })
            .then((res: any) => {
            })
            .catch((err) => console.log(err));
    }

    return (
        <Card
            className={classes.root}
            style={{
                marginBottom: "10px",
                boxShadow:
                    "1px 1px 1px -1px rgba(0,0,0,0.2), 1px 2px 1px 0px rgba(0,0,0,0.14), 1px 3px 11px 4px rgba(0,0,0,0.12)",
            }}
        >
            <CardContent>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    Question
                    < Chip
                        style={
                            isImportant
                                ? { float: "right", backgroundColor: "#f50057", color: "white" }
                                : { float: "right" }
                        }
                        icon={
                            <Switch
                                checked={isImportant}
                                onChange={handleChange}
                                color="primary"
                                name="isImportant"
                                inputProps={{ "aria-label": "primary checkbox" }}
                                disabled={isSupport ? false : true}
                            />
                        }
                        label="Important"
                    ></Chip>
                </Typography>
                <Typography
                    className={classes.subtitle}
                    color="textSecondary"
                    gutterBottom
                >
                    {`Posted by: ${data.postedBy}`}
                </Typography>
                <Typography
                    className={classes.subtitle}
                    color="textSecondary"
                    gutterBottom
                >
                    {`Email address: ${data.email}`}
                </Typography>
                <Typography variant="body2" component="p">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon">
                            </span>
                        </div>
                        <textarea
                            style={{ height: "auto" }}
                            rows={handleTextareaHeight(data.question)}
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            value={data.question}
                            disabled={true}
                        ></textarea>
                    </div>
                </Typography>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    Answer
                </Typography>
                <Typography variant="body2" component="p">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon">
                                {isSupport && <CreateIcon></CreateIcon>}
                            </span>
                        </div>
                        <textarea
                            rows={handleTextareaHeight(data.answer ? data.answer : answer)}
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            value={data.answer ? data.answer : answer}
                            onChange={(event) => setAnswer(event.target.value)}
                            disabled={isSupport ? false : true}
                        ></textarea>
                    </div>
                </Typography>
            </CardContent>
            <CardActions>
                {isSupport && (
                    <div>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit Answer
                        </Button>
                        <Button
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={() => { handleReport(data) }}
                        >
                            <IconButton aria-label="settings">
                                <ReportIcon />
                            </IconButton>
                        </Button>
                    </div>
                )}
                {isAdmin && (
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={handleDelete}
                    >
                        <DeleteForeverIcon />
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default SupportMessage;
