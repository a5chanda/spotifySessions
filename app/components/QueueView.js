import React, { Component } from 'react';
import SpotifyWebAPI from 'spotify-web-api-js';
import {getValidSPObj, makeSong} from '../utils/spotifyFunctions.js';
import { Container, Header, Content, Button, Text, View } from 'native-base';
import Modal from 'react-native-modal';
import {ListItem, SearchBar} from 'react-native-elements';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export class QueueView extends Component{
    constructor(props){
        //queue array is passed through props
        super(props);
        this.state ={

        }
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(data){
        console.log("handle", data);
        this.props.song(data);
    }

    render(){
        return(
            <View style={styles.container}>  
                <ScrollView>
                {this.props.queue.map((song, i) => (
                    <TouchableOpacity key={i} onPress={() => this.handleChange(song)}>
                        <ListItem
                            key={i}
                            leftAvatar={{ rounded:false, source: { uri: song['albumArt'][0]['url']} }}
                            title={song.songName}
                            subtitle={song.mainArtist}
                            bottomDivider
                        />
                    </TouchableOpacity>
                ))}
                </ScrollView>
            </View>
            
        )       
    };
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   backgroundColor: "#16161D",
      marginTop: '10%',
   
      borderRadius: 20
    },

});

