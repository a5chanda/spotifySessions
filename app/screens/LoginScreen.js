import React, { Component } from 'react';
import {
  View, Button
} from 'react-native';

import {refreshTokens, getUserData, setUserData} from '../utils/authorization.js';



class LoginScreen extends Component {
    state = {  }

    render() {
        return (
            
            <Button style={{
                position: 'absolute',
                bottom:0,
                left:0,
            }} onPress={() => authHandler.onLogin()} title="Press to login"/>
            
        );
    }
}

export default LoginScreen;
