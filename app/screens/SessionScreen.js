import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { BackHandler, Image, Platform, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { SearchBar } from 'react-native-elements';
import { SearchResults } from './SearchResults.js';
import { MembersView } from './MembersView.js';


import { MonoText } from '../components/StyledText';
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';

import SpotifyWebAPI from 'spotify-web-api-js';
import {getUserData} from '../utils/authorization.js';
import {getValidSPObj, makeSong} from '../utils/spotifyFunctions.js';
import {socket} from '../utils/socketConnection.js'




class SessionScreen extends Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.socket = socket;
        this.state = {
            userProfile: props['route']['params']['userProfile'],  
            chatMessage: "",
            chatMessages: [],
            roomName: props['route']['params']['roomName'],
            isConnected: this.socket.connected, //if socket connection is connected
            isCreatingRoom: props['route']['params']['isCreatingRoom'], //true if new session being created
                                                                        //false if joining a session
            host: props['route']['params']['host'] ? props['route']['params']['host'] : "",
            roomCreated: props['route']['params']['roomCreated'] ? props['route']['params']['roomCreated']: null, //true if room created, false if it isnt
            joinedRoom: false,
            songQueue: [],
            songID: "",
            searchText: "",

            members: [] //array of room members
        };
        this.bindSong = this.bindSong.bind(this);

        console.log("Loading room");
        //If socket is connected, create room if the host is connecting
        if(this.state.isConnected && this.state.isCreatingRoom && !this.state.joinedRoom){
            //if the host is the user creating the session
            if(this.state.host === this.state.userProfile['display_name']){  
                this.createRoom();
            }
        }
        //Else join a room
        else if(!this.state.joinedRoom){
            this.joinRoom();
        }
    }

    componentDidMount() {
        this._isMounted=true;
        //if socket is disconnected, reconnect
        if((!this.socket.connected || !this.state.isConnected)){
            this.socket.connect();
            if(!this.state.roomCreated && (this.state.userProfile['display_name'] === this.state.host)){
                this.createRoom();
            }
            else if(!this.state.roomCreated && !this.state.joinedRoom){
                this.joinRoom()
                // this.socket.emit("join room", this.state.roomName);
            }
            this.setState({isConnected: true});
        }
    
        this.socket.on("create room", data => {
            //if Room is successfully created then set state for creating to false
            console.log("Room created:", data['isCreated']);
            this.setState({isCreatingRoom: !data['isCreated'], roomCreated: data['isCreated'], members: data['MemberNames'] });
            
        });

        this.socket.on("join room", data => {
            console.log("Joined:", data);

            this.setState({isCreatingRoom: false, roomCreated: true, songQueue: data['Queue'], members: data['MemberNames']});
            console.log("Members: ", data['MemberNames']);
        });
        this.socket.on("chat message", msg => {
            this.setState({ chatMessages: [...this.state.chatMessages, msg]});
        });
        this.socket.on("add song", song => { 
            this.setState({songQueue: [...this.state.songQueue, song]});
            console.log("Updated Queue", this.state.songQueue);
        });

        //When someone leaves the room
        this.socket.on ("leave room", data => {
            this.setState({members: data['MemberNames']});
        });
        
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        this._isMounted=false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton());
        this.socket.disconnect();
        // this.setState({isConnected: false});
        // this.disconnect();
    }

    async createRoom(){
        console.log("Creating Room:", this.state['roomName'], "Host:", this.state['userProfile']['display_name']);
        let authHost = await getUserData('accessToken');
        let expTime = await getUserData('expirationTime');
        this.socket.emit("create room", 
        {
            name: this.state.roomName,
            user: this.state.userProfile['display_name'],
            isHost: true,
            authToken: authHost,
            expirationTime: expTime
        });
        this.setState({isCreatingRoom: false, roomCreated: true, joinedRoom: true});
    }

    async joinRoom(){
        console.log("Joining Room: ", this.state.roomName, "Member:", this.state['userProfile']['display_name']);
        let authHost = await getUserData('accessToken');
        var expTime =  await getUserData('expirationTime');
      
        this.socket.emit("join room", 
        {
            name: this.state.roomName,
            user: this.state.userProfile['display_name'],
            isHost: false,
            authToken: authHost,
            expirationTime: expTime
        });
        this.setState({roomCreated: true, joinedRoom: true});
    }

    async addSong(song){
        this.socket.emit("add song", song);
        this.setState({songID: ""});
    }
    
    leaveRoom(){
        console.log("Leaving Room: ", this.state.roomName, "Member:", this.state['userProfile']['display_name']);
        this.socket.emit("leave room", 
        {
            name: this.state.roomName,
            user: this.state.userProfile['display_name'],
            isHost: false,
            authToken: ""
        });
        
    }

    handleBackButton() {
        return true;
    }

    submitChatMessage() {
        this.socket.emit('chat message', this.state.chatMessage);
        this.setState({chatMessage: ''});
        var song = "track:"+this.state.chatMessage;
        this.getSong(song);
        this.addSong(this.state.chatMessage);
    }

    disconnect(){
        this.leaveRoom();
        this.setState({isConnected: false, isCreatingRoom: null, roomCreated: false, joiningRoom: false});
        this.socket.disconnect();
        this.props.navigation.goBack()
    }

    bindSong(data){
        console.log("Bound song: ", data);
        // this.setState({songID: data['trackID']});
        this.addSong(data);
        
    }
  render(){
    // const chatMessages = this.state.songQueue.map(chatMessage => (
    //     <Text style={{borderWidth: 2, top: 500}}>{chatMessage}</Text>
    //     ));
    
  
    return ( 
         
        <View style={styles.container}>
            <SearchResults searchText = {this.state.searchText} selectedSong={this.bindSong} /> 

            {(this.state.members) ? <MembersView members={this.state.members} /> : <View></View>}
            {/* {chatMessages} */}
        
            {/* <TextInput
            style={{height: 40, borderWidth: 2, top: 500}}
            autoCorrect={false}
            value={this.state.chatMessage}
            onSubmitEditing={() => this.submitChatMessage()}
            onChangeText={chatMessage => {
                this.setState({chatMessage});
            }}
            /> */}
            <View style={styles.button}>
                <Button large danger onPress={()=> this.disconnect()}>
                    <Text style={{textAlign:"center", flex:1}}>Disconnect</Text>
                </Button>
            </View>
      </View>
    );
  }
}

export default SessionScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      marginTop: '10%',
    },
    button: { 
        flex:1,
        justifyContent: 'flex-end',
        marginBottom: '-5%',
        width: "100%",
      }
  });

