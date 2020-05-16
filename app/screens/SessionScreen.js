import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { BackHandler, Image, Platform, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';

import SpotifyWebAPI from 'spotify-web-api-js';
import {getUserData} from '../utils/authorization.js';
import {getValidSPObj} from '../utils/spotifyFunctions.js';
import {socket} from '../utils/socketConnection.js'




class SessionScreen extends Component {
    constructor(props){
        super(props);
        this.socket = socket;
        this.state = {
            userProfile: props['route']['params']['userProfile'],  
            chatMessage: "",
            chatMessages: [],
            roomName: props['route']['params']['roomName'],
            isConnected: this.socket.connected,
            host: props['route']['params']['host']
        };

        //If socket is connected, create room if the host is connecting
        if(this.state.isConnected){
            if(this.state.host === this.state.userProfile['display_name']){
                console.log("Loading room");
                this.createRoom();
            }
            // this.socket.emit("join room", this.state.roomName);
        }
    }

    async createRoom(){
        console.log("Creating Room:", this.state['roomName'], "Host:", this.state['userProfile']['display_name']);
        let authHost = await getUserData('accessToken');
        this.socket.emit("create room", 
        {
            name: this.state.roomName,
            user: this.state.userProfile['display_name'],
            isHost: true,
            authToken: authHost
        });
    }
    

    componentDidMount() {
        if(!this.socket.connected || !this.state.isConnected){
            this.socket.connect();
            this.socket.emit("join room", this.state.roomName);
            this.setState({isConnected: true});
        }
        else{
            this.socket.on("chat message", msg => {
                this.setState({ chatMessages: [...this.state.chatMessages, msg]});
            });
            this.socket.on("join room", data => {
                console.log("Data:", data);
            });
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton());
        this.socket.disconnect();
        this.setState({isConnected: false});
        // this.disconnect();
    }


    handleBackButton() {
        return true;
    }

    submitChatMessage() {
        this.socket.emit('chat message', this.state.chatMessage);
        this.setState({chatMessage: ''});
        var song = "track:"+this.state.chatMessage;
        this.getSong(song);
    }

    getSong = async (data) => {
      const sp = await getValidSPObj();
      console.log("SONGGGGGGG\n\n\n\n\n\n\n");
      sp.searchTracks(data, {limit: 3, offset: 0, market: "US"} ).then(result => console.log("Song: ", result.tracks.items[0]));
    };  

    disconnect(){
        this.setState({isConnected: false});
        this.socket.disconnect();
        this.props.navigation.goBack()
    }

  render(){
    // console.log("Session: ", this.state.chatMessages);
    const chatMessages = this.state.chatMessages.map(chatMessage => (
        <Text style={{borderWidth: 2, top: 500}}>{chatMessage}</Text>
        ));
    return (

      
        <View style={styles.container}>

            <Button style={styles.button} onPress={()=> this.disconnect()}>
                <Text>Disconnect</Text>
            </Button>

            {chatMessages}
            <TextInput
                style={{height: 40, borderWidth: 2, top: 600}}
                autoCorrect={false}
                value={this.state.chatMessage}
                onSubmitEditing={() => this.submitChatMessage()}
                onChangeText={chatMessage => {this.setState({chatMessage});}}
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
    button: {  
        backgroundColor:"#30ba7e",
        alignItems:"center",
        marginBottom:10,
        width: "90%",
        marginLeft: "5%",
        marginTop: "10%"
      }
  });

