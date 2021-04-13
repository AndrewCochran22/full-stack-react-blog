import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute(props) {
    const user = useSelector((state) => state.user);

    if (user) {
        return <Route {...props} />
    } else {
        return <Redirect to="/login" />
    }
}
