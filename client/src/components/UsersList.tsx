import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Axios from 'axios';
import environment from '../config/default';
import AuthenticationService from '../services/Authentication.service';
import { Button, IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ReportIcon from '@material-ui/icons/Report';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        inline: {
            display: 'inline',
        },
    }),
);

const UsersList: React.FC = (props: any) => {
    const classes = useStyles();
    const [once, setOnce] = useState(true);
    const [data, setData] = useState([])

    useEffect(() => {
        if (once) {
            fetchData()
            setOnce(false)
        }
    })

    const fetchData = () => {
        Axios
            .get(`${environment.apiUrl}/users/`, {
                headers: {
                    Authorization: `Bearer ${AuthenticationService.token}`,
                },
            })
            .then((res: any) => {
                setData(res.data);
                console.log(res.data)
            })
            .catch((err) => console.log(err));
    }

    const handleDelete = (user) => {
        Axios
            .delete(`${environment.apiUrl}/users/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${AuthenticationService.token}`,
                },
            })
            .then((res: any) => {
            })
            .catch((err) => console.log(err));
    }
    const handleReport = (user) => {
        Axios
            .post(`${environment.apiUrl}/users/report`,
                {
                    id: user._id,
                    email: user.email
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
        <List className={classes.root}>
            {data.map((item, i) => (
                <div>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={item.username} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${item.lastName} ${item.lastName}`}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        Username -
                                    </Typography>
                                    {` ${item.username}`}
                                </React.Fragment>
                            }
                        />
                        <Button
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={() => { handleReport(item) }}
                        >
                            <IconButton aria-label="settings">
                                <ReportIcon />
                            </IconButton>
                        </Button>
                        <Button
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={() => { handleDelete(item) }}
                        >
                            <IconButton aria-label="settings">
                                <DeleteForeverIcon />
                            </IconButton>
                        </Button>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </div>
            ))}
        </List>
    )
}

export default UsersList;