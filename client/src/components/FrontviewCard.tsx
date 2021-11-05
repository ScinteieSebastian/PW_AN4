import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import {
    MenuProps,
    MenuItem,
    Menu,
} from "@material-ui/core";
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red, blue, grey } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Button, colors } from "@material-ui/core";
import AuthenticationService from "../services/Authentication.service";
import CheckIcon from '@material-ui/icons/Check';
import environment from "../config/default";
import Axios from "axios";
import history from "./History";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        media: {
            textAlign: "center",
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        header: {
            backgroundColor: "#32353885",
            color: "white",
        },
        avatar: {
            backgroundColor: red[500],
        },
        avatarApprove: {
            backgroundColor: grey[500],
        },
        img: {
            width: "90%",
        },
    }),
);

const FrontviewCard: React.FC = (props: any) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [data, setData] = useState(props.children);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isAdmin, setIsAdmin] = useState(
        AuthenticationService.currentUserValue.role == "admin" ? true : false
    );

    useEffect(() => {
        setData(props.children)
    }, [props])

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleStart = () => {
        history.push("/user/game", {...{type: "create", idCard: data.id}})
    }
    const handleDelete = () => {
        Axios
            .delete(`${environment.apiUrl}/games/${data.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.token}`,
                    },
                })
            .then((res: any) => {
                data.fetch();
            })
    }
    const handleApprove = () => {
        Axios
            .put(`${environment.apiUrl}/games/approve/`,
                {
                    id: data.id,
                    approved: !data.approved
                },
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.token}`,
                    },
                })
            .then((res: any) => {
                data.fetch();
            })
            .catch((err) => console.log(err));
    }

    const handleAddToFavorites = () => {
        Axios
            .put(`${environment.apiUrl}/users/favorites/`,
                {
                    username: AuthenticationService.currentUserValue.username,
                    gameId: data.id
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

    const StyledMenu = withStyles({
        paper: {
            border: "1px solid #d3d4d5",
        },
    })((props: MenuProps) => (
        <Menu
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            {...props}
        />
    ));

    const dropdown = (
        <div>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
            </Button>
            <StyledMenu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </StyledMenu>
        </div>
    )

    return (
            <Card className={classes.root} style={{ margin: "auto", border: "solid 1px #424242", background: "#0000008f" }}>
                <CardHeader
                    className={classes.header}
                    avatar={
                        <Avatar className={data.approved ? classes.avatar : classes.avatarApprove}>
                            {isAdmin && <Button
                                style={{ color: "white" }}
                                onClick={handleApprove}>
                                <CheckIcon />
                            </Button>}
                            {!isAdmin && (data.mode !== "game") &&
                                <Button
                                    style={{ color: "white" }}
                                    onClick={handleStart}>
                                    <PlayArrowIcon />
                                </Button>}
                            {(data.mode === "game") &&
                                <span>{data.title.substring(0,1)}</span>
                            }
                        </Avatar>
                    }
                    action={isAdmin && dropdown}
                    title={data.title}
                />
                <CardMedia className={classes.media}>
                    <img className={classes.img} src={data.image}></img>
                </CardMedia>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" style={{ color: "white" }}>
                        {data.desc}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    {(data.mode !== "game") &&
                    (<IconButton
                        aria-label="add to favorites"
                        onClick={handleAddToFavorites}
                        style={{ color: "red" }}>    
                        <FavoriteIcon />
                    </IconButton>)}
                    {(data.mode != "game" || data.gameRole == "storyteller") && (<IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        style={{ color: "white" }}
                    >
                        <ExpandMoreIcon />
                    </IconButton>)}
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph style={{ color: "white" }}>
                            {data.story}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
    );
}

export default FrontviewCard;