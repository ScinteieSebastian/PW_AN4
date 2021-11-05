import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthenticationService from '../services/Authentication.service';


export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props: any) => {
        const currentUser = AuthenticationService.currentUserValue;
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        // authorised so return component
        return <Component {...props} />
    }} />
)

export default PrivateRoute;
