import React, { Component } from 'react';
import {StyleSheet} from 'react-native';

import { Container, Header, Content, Button, Text, View } from 'native-base';

import {refreshTokens, getUserData, setUserData} from '../utils/authorization.js';
import { TouchableOpacity } from 'react-native-gesture-handler';

async function login(){
    const tokenExpirationTime = await getUserData('expirationTime');
    if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
      await refreshTokens();
      
    } else {
      this.setState({ accessTokenAvailable: true });
    }
}

class LoginScreen extends Component {
    state = {  }
    render() {
        return (
            <Container style={styles.container}> 
             <View style={styles.inputView} >
                 <Text style={styles.logo}>Spotify Sessions</Text>
             </View>
                <Button block rounded style={styles.button} onPress={() => login()}> 
                    <Text style={styles.login}>Login</Text> 
                </Button>
            </Container>
        );
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    button: {  
        backgroundColor:"#30ba7e",
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        width: "90%",
        marginLeft: "5%"
    },
    login: {
        color: "white"
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#202e3a',
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#30ba7e",
        marginBottom:40
      }
});
