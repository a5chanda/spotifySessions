import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { Image, Platform, StyleSheet,TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { Container, Header, Content, Button, Text, View } from 'native-base';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';

import SpotifyWebAPI from 'spotify-web-api-js';
import {getValidSPObj} from '../utils/spotifyFunctions.js';
import { AntDesign } from '@expo/vector-icons';


class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      userProfile: {},
      isProfileLoaded:false,
      newSession: false,
      joinSession: false,
      roomName: ""
    };
  }
  
  getUser = async () => {
    const sp = await getValidSPObj();
    const { id: userId } = await sp.getMe();
    const user = await sp.getUser(userId);
    // console.log(user);
    if(!this.state.isProfileLoaded){
        this.setState({
            userProfile: user,
            isProfileLoaded: true,
        });
        console.log("User:", (this.state.userProfile['display_name']));
    }
    return user;
  };

  render(){
    this.getUser();
    
    return (
      
      <View style={styles.container}>
        
        {/* New Session Modal */}
        <Modal transparent={false} visible ={this.state.newSession} animationType="fade">
          <View style={styles.modalContent}>
            <AntDesign style={{marginBottom:30}} name="closecircleo" size={24} color="black" onPress={()=> this.setState({newSession: false}) }/>
            <View>
              <TextInput style={{height: "12%", marginBottom:30, borderRadius: 5, borderWidth: 2, borderColor: "black", textAlign:"center"}} placeholder="Enter Session Name" onChangeText={name => this.setState({roomName: name})}/>
              <TextInput style={{height: "12%", marginBottom:30, borderRadius: 5, borderWidth: 2, borderColor: "black", textAlign:"center"}} secureTextEntry={true} placeholder="Enter Password"/>
                <Button block rounded style={styles.modalButton} onPress={ () => {
                        if(this.state.roomName.length){
                            this.props.navigation.navigate("Session", 
                            {
                                "userProfile": this.state.userProfile, 
                                "roomName": this.state.roomName, 
                                "host": this.state.userProfile['display_name'],
                                "isCreatingRoom": true,
                            });
                            this.setState({newSession: false});
                        }
                        else{
                            <Text>Please Enter Room Name</Text>
                        } 
                    }
                }>  
                    <Text style={styles.login}> Create New Session</Text> 
                </Button>
            </View>
          </View>
        </Modal>
        {/* Join Session Modal */}
        <Modal transparent={false} visible ={this.state.joinSession} animationType="fade">
          <View style={styles.modalContent}>
            <AntDesign style={{marginBottom:30}} name="closecircleo" size={24} color="black" onPress={()=> this.setState({joinSession: false}) }/>
            <View>
              <TextInput style={{height: "12%", marginBottom:30, borderRadius: 5, borderWidth: 2, borderColor: "black", textAlign:"center"}} placeholder="Enter Session Name" onChangeText={name => this.setState({roomName: name})}/>
              <TextInput style={{height: "12%", marginBottom:30, borderRadius: 5, borderWidth: 2, borderColor: "black", textAlign:"center"}} secureTextEntry={true} placeholder="Enter Password"/>
              <Button block rounded style={styles.modalButton} onPress={ () => {
                        if(this.state.roomName.length){
                            this.props.navigation.navigate("Session", 
                            {
                                "userProfile": this.state.userProfile, 
                                "roomName": this.state.roomName, 
                                "isCreatingRoom": false,
                                "roomCreated": true
                            });
                            this.setState({joinSession: false});
                        }
                        else{
                            <Text>Please Enter Room Name</Text>
                        }} 
                    }>  
                  <Text style={styles.login}>Join Session</Text> 
              </Button>
            </View>
          </View>
        </Modal>

        <Image style={styles.welcomeImage} source={require('../assets/images/spotifysession.png')}></Image>
        <Text style={styles.logo}>Welcome {this.state.userProfile['display_name']}</Text>

        { (this.state.isProfileLoaded && this.state.userProfile['images'].length) ? (<Image
        style={styles.profileImage}
        source={ {'uri': this.state.userProfile['images'][0].url} }/>) : (<View></View>)
        }
        <Button block rounded style={styles.button} onPress={()=> this.setState({newSession: true}) }>  
          <Text style={styles.login}>New Session</Text> 
        </Button>
        <Button block rounded style={styles.button} onPress={()=> this.setState({joinSession: true}) }> 
          <Text style={styles.login}>Join Session</Text> 
        </Button>
      </View>
    );
  }
}

export default HomeScreen;


HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  profileImage: {
    flex:1,
    height: 50,
    width: 50,
    marginBottom: 32,
    borderRadius: 25
  },
  logo:{
    flex:1,
    fontWeight:"bold",
    fontSize:25,
    color:"#30ba7e",
    marginBottom:40
  },
  container: {
    flexDirection: "column",
    flex:1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#202e3a',
  },
  welcomeImage: {
    flex: 1,
    aspectRatio: 0.9,
    resizeMode: 'contain'
  },
  button: {  
    flex:1,
    backgroundColor:"#30ba7e",
    alignItems:"center",
    marginBottom:50,
    width: "90%",
    marginLeft: "5%",
  },
  modalButton: {
    width: "50%",
    backgroundColor:"#30ba7e",
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});
