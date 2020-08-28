import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { Dimensions, Image, Platform, StyleSheet,TouchableHighlight, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native';
import { Container, Header, Content, Button, Text, View, H1, H2, H3 } from 'native-base';
import Modal from 'react-native-modal';


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
      roomName: "",
      visible: false
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

  toggleOverlay() {
    this.setState({visible: !this.state.visible});
  };

  render(){
    this.getUser();
    
    return (
      
      <View style={[styles.container, ((this.state.newSession || this.state.joinSession) ? {backgroundColor: 'rgba(0,0,0,0.5)'} : '')] }>
        
      
        <KeyboardAvoidingView style={styles.content}>
            
            <Image style={styles.welcomeImage} source={require('../assets/images/spotifysession.png')}></Image>
            <Text style={styles.logo}>Welcome {this.state.userProfile['display_name']}</Text>

            { (this.state.isProfileLoaded && this.state.userProfile['images'].length) ? 
            (<Image style={styles.profileImage} source={ {'uri': this.state.userProfile['images'][0].url} }/>) : (<View></View>)
            }

            <View style={styles.buttonContainer}>
            
                <Button block rounded style={styles.button}  onPress={()=> this.setState({newSession: true}) }>  
                    <Text style={styles.login}>New Session</Text> 
                </Button>
                
                <Button block rounded style={styles.button} onPress={()=> this.setState({joinSession: true}) }> 
                    <Text style={styles.login}>Join Session</Text> 
                </Button>
            </View>
            
            
        </KeyboardAvoidingView>
        

        

        {/* New Session Modal */}
        <Modal  transparent={true} onBackdropPress={()=>this.setState({newSession: false})} visible ={this.state.newSession} animationType="fade" style={styles.modalWrapper}>
            <View style={styles.modalContent} >
                <H2>New Session</H2> 
                <Text></Text>
                
                <View styles={{marginTop: 60}}>
                    <TextInput style={styles.modalTextInput} placeholder="Enter Session Name" onChangeText={name => this.setState({roomName: name})}/>
                    <TextInput style={styles.modalTextInput} secureTextEntry={true} placeholder="Enter Password"/>
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
                <AntDesign style={{marginBottom:"-10%"}} name="closecircleo" size={35} color="red" onPress={()=> this.setState({newSession: false}) }/>
            </View>
        </Modal>

        {/* Join Session Modal */}
        <Modal transparent={true} onBackdropPress={()=>this.setState({joinSession: false})} visible ={this.state.joinSession} animationType="fade" style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <H2>Join Session</H2> 
            <Text></Text>
            <View>
                
                <TextInput style={styles.modalTextInput} placeholder="Enter Session Name" onChangeText={name => this.setState({roomName: name})}/>
                <TextInput style={styles.modalTextInput} secureTextEntry={true} placeholder="Enter Password"/>
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
            <AntDesign style={{marginBottom:"-10%"}} name="closecircleo" size={35} color="red" onPress={()=> this.setState({joinSession: false}) }/>
          </View>
        </Modal>
      
      
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
        flex:2,
        height: 200,
        width: 200,
        marginBottom: 32,
        borderRadius: 200/2
    },
    logo:{
        flex:.5,
        fontWeight:"bold",
        fontSize:25,
        color:"#30ba7e",
    
    },

    container: {
        flexDirection: "column",
        flex:1,
        alignItems: "center",
        minHeight: Math.round(Dimensions.get('window').height), //fix for keyboard not pushing view upwards
        // backgroundColor: '#202e3a'
    },

    content: {
        flex:1,
        flexDirection: 'column',
        alignItems:'center',
        justifyContent: "center",
    },
    buttonContainer: {
        flex: 4,
        flexDirection: 'column',
        alignItems:'flex-start',
        justifyContent: "flex-start",
    },

    welcomeImage: {
        flex: 1.5,
        aspectRatio: 0.9,
        resizeMode: 'contain',
        marginTop: 60
        
    },

    button: {  
        flex:1,
        backgroundColor:"#30ba7e",
        alignItems:"center",
        marginBottom:40,
        width: "90%",
    },

    modalButton: {
        width: "50%",
        backgroundColor:"#30ba7e",
        marginBottom: 1
    },

    modalWrapper: {
        flex: 1,
        //top: Dimensions.get('window').height/4, 
        //maxHeight:300, 
        borderRadius:30,
        minHeight: Math.round(Dimensions.get('window').height),
        paddingBottom: -20
        
    },
    modalContent: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F7F2",
        borderRadius: 30,
        
    },
    modalTextInput:{
        height: "15%", 
        marginBottom:30, 
        borderRadius: 5, 
        borderBottomWidth: 2, 
        borderColor: "#30ba7e"
    }

});
