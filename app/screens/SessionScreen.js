import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';

import SpotifyWebAPI from 'spotify-web-api-js';
import {getValidSPObj} from '../utils/spotifyFunctions.js';


import io from "socket.io-client";
import {serverURI} from "../config/env.js";


class SessionScreen extends Component {
  constructor(props){
    super(props);
    this.socket = io(serverURI);
    // console.log("Session: ", props.route.params);
    this.state = {
      userProfile: props['route']['params'],  
      chatMessage: "",
      chatMessages: []
    };
  }

  componentDidMount() {
    console.log("mounted")
     this.socket.on("chat message", msg => {
           this.setState({ chatMessages: [...this.state.chatMessages, msg]   
      });
   });
 }
 submitChatMessage() {
    this.socket.emit('chat message', this.state.chatMessage);
    this.setState({chatMessage: ''});
  }


  render(){
    console.log("Session: ", this.state.chatMessages);
    const chatMessages = this.state.chatMessages.map(chatMessage => (
        <Text style={{borderWidth: 2, top: 500}}>{chatMessage}</Text>
        ));
    return (

      
      <View style={styles.container}>
          {/* <Image style={styles.welcomeImage} source={require('../assets/images/spotifysession.png')}></Image> */}
          {/* <Text style={styles.logo}>Welcome {this.props.userProfile['display_name']}</Text> */}
          
          {/* { (this.state.isProfileLoaded && this.state.userProfile['images'].length) ? (<Image
          style={styles.profileImage}
          source={ {'uri': this.state.userProfile['images'][0].url} }/>) : (<View></View>)
          } */}

          {/* <Button block rounded style={styles.button}>  
            <Text style={styles.login}>New Session</Text> 
          </Button> */}

        {chatMessages}
        <TextInput
          style={{height: 40, borderWidth: 2, top: 600}}
          autoCorrect={false}
          value={this.state.chatMessage}
          onSubmitEditing={() => this.submitChatMessage()}
          onChangeText={chatMessage => {
            this.setState({chatMessage});
          }}
        />

      </View>
    );
  }
}

export default SessionScreen;

const styles = StyleSheet.create({
    container: {
      height: 400,
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
  });


// const styles = StyleSheet.create({
//   profileImage: {
//     height: 64,
//     width: 64,
//     marginBottom: 32
//   },
//   logo:{
//     fontWeight:"bold",
//     fontSize:20,
//     color:"#30ba7e",
//     marginBottom:40
//   },
//   container: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: '#202e3a',
//   },
//   contentContainer: {
//     paddingTop: 30,
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   welcomeImage: {
//     flex: 1,
//     aspectRatio: 0.35,
//     resizeMode: 'contain'
//   },
//   button: {  
//     backgroundColor:"#30ba7e",
//     alignItems:"center",
//     marginBottom:10,
//     width: "90%",
//     marginLeft: "5%"
//   },


// });
