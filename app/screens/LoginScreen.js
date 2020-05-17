import React, { Component, useCallback, useState } from 'react';
import {StyleSheet} from 'react-native';

import { Container, Header, Content, Button, Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';


import * as AuthSession from 'expo-auth-session';
import { encode as btoa } from 'base-64';
import {spotifyCredentials} from '../utils/spotifyConfigs';
import { AsyncStorage } from 'react-native';


export const setUserData = async (key, val) => {
    try {
        console.log('storing', key, val);
        if((typeof val) == "number"){            
            // console.log("here", typeof val);
            var v = val.toString();
            // console.log(typeof v);
            await AsyncStorage.setItem(key, v);
        }
        else{
            await AsyncStorage.setItem(key, val);
        }
        
    } catch (error) {
      // Error saving data
    }
 };

export const getUserData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
};


const scopesArr = ['user-modify-playback-state','user-read-currently-playing','user-read-playback-state','user-library-modify',
                   'user-library-read','playlist-read-private','playlist-read-collaborative','playlist-modify-public',
                   'playlist-modify-private','user-read-recently-played','user-top-read'];
const scopes = scopesArr.join(' ');



class LoginScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            accessTokenAvailable: false
        };
    }

    getAuthorizationCode = async () => {
        try {
          const credentials = spotifyCredentials
          const redirectUrl = AuthSession.getRedirectUrl(); //this will be something like https://auth.expo.io/@your-username/your-app-slug
          const result = await AuthSession.startAsync({
            authUrl:
              'https://accounts.spotify.com/authorize' +
              '?response_type=code' +
              '&client_id=' +
              credentials.clientId +
              (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
              '&redirect_uri=' +
              encodeURIComponent(redirectUrl),
          });
          
          if(result.params.code){
              return result.params.code;
          }
        } catch (err) {
          console.error(err);
          return;
        }
         
    }

    getTokens = async () => {
        try {
          const authorizationCode = await this.getAuthorizationCode() //we wrote this function above
          const credentials = spotifyCredentials
          const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              Authorization: `Basic ${credsB64}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
              credentials.redirectUri
            }`,
          });
          const responseJson = await response.json();
          // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
          const {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn,
          } = responseJson;
      
          const expirationTime = new Date().getTime() + expiresIn * 1000;
          await setUserData('accessToken', accessToken);
          await setUserData('refreshToken', refreshToken);
          await setUserData('expirationTime', expirationTime);
          this.setState({accessTokenAvailable: true});
        } catch (err) {
          console.error(err);
        }
    }
    refreshTokens = async () => {
        try {
          const credentials = spotifyCredentials 
          const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
          const refreshToken = await getUserData('refreshToken');
          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              Authorization: `Basic ${credsB64}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
          });
          const responseJson = await response.json();
          if (responseJson.error) {
            await this.getTokens();
          } else {
            const {
              access_token: newAccessToken,
              refresh_token: newRefreshToken,
              expires_in: expiresIn,
            } = responseJson;
      
            const expirationTime = new Date().getTime() + expiresIn * 1000;
            await setUserData('accessToken', newAccessToken);
            if (newRefreshToken) {
                console.log(newRefreshToken);
                console.log(expirationTime);
                
              await setUserData('refreshToken', newRefreshToken);
    
            }
            await setUserData('expirationTime', expirationTime);
        } 
      }
      catch (err) {
        console.error(err)
      }
    }

    async login(){
        const tokenExpirationTime = await getUserData('expirationTime');
        if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
          await this.refreshTokens();    
        } else {
            this.setState({ accessTokenAvailable: true });
            console.log("Logged in", this.state.accessTokenAvailable);
        //   setTokenAvailable(true);
        }
    }
    
    
    render() {
        return (
            <Container style={styles.container}> 
             <View style={styles.inputView} >
                 <Text style={styles.logo}>Spotify Sessions</Text>
             </View>
                {(!this.state.accessTokenAvailable) ?
                    (
                        <Button block rounded style={styles.button} onPress={() => this.login()}> 
                            <Text style={styles.login}>Login</Text> 
                        </Button>
                    ) :
                    (   
                        <View>
                            <Button block rounded style={styles.button} onPress={() => this.props.navigation.navigate('Home')}> 
                                <Text style={styles.login}>Continue</Text> 
                            </Button> 
                        </View>
                        
                    )
                }
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

