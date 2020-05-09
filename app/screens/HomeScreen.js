import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';

import SpotifyWebAPI from 'spotify-web-api-js';
import {getValidSPObj} from '../utils/spotifyFunctions.js';


class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      userProfile: {},
      isProfileLoaded:false
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
            isProfileLoaded: true
        });
    }
    return user;
  };

  render(){
    this.getUser();
    
    return (
      
      <View style={styles.container}>
          <Image style={styles.welcomeImage} source={require('../assets/images/spotifysession.png')}></Image>
          <Text style={styles.logo}>Welcome {this.state.userProfile['display_name']}</Text>
          
          { (this.state.isProfileLoaded && this.state.userProfile['images'].length) ? (<Image
          style={styles.profileImage}
          source={ {'uri': this.state.userProfile['images'][0].url} }/>) : (<View></View>)
          }
          <Button block rounded style={styles.button}>  
              <Text style={styles.login}>New Session</Text> 
          </Button>
          <Button block rounded style={styles.button}> 
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
    height: 64,
    width: 64,
    marginBottom: 32
  },
  logo:{
    fontWeight:"bold",
    fontSize:20,
    color:"#30ba7e",
    marginBottom:40
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#202e3a',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    flex: 1,
    aspectRatio: 0.35,
    resizeMode: 'contain'
  },
  button: {  
    backgroundColor:"#30ba7e",
    alignItems:"center",
    marginBottom:10,
    width: "90%",
    marginLeft: "5%"
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
