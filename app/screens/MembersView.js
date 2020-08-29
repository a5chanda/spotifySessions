import React, { Component } from 'react';
import SpotifyWebAPI from 'spotify-web-api-js';
import {getValidSPObj, makeSong} from '../utils/spotifyFunctions.js';
import {Container, Header, Content, Button, Text, View } from 'native-base';
import Modal from 'react-native-modal';
import {Avatar, ListItem} from 'react-native-elements';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

export class MembersView extends Component{
    constructor(props){
        super(props);
        this.state ={
            // searchText: "",
            // searchResults: [],

        }
       // this.handleChange = this.handleChange.bind(this);
    }

    // getSong = async (data) => {
    //     const sp = await getValidSPObj();
    //     data = "track:" + data;
    //     sp.searchTracks(data, {limit: 50, offset: 0, market: "US"} ).then(result =>{ 
    //         let arr =[];
    //         (result.tracks.items).map(song => {
    //             arr.push(makeSong(song));
    //         });
    //         //console.log("songs results", arr);
    //         this.setState({searchResults: arr});
    //     });
    // }; 

    // handleChange(song){
    //     console.log("handle", song);
    //     this.props.selectedSong(song);
    // }

    render(){
        return(
            <View style={{backgroundColor:"#383737", paddingTop: 10}}>  
                <Text style={{fontSize:25, fontWeight:'bold', marginBottom:10, color:'white'}}> Members</Text>
                <ScrollView  horizontal={true} style={{}}>
                {this.props.members.map((item, i) => (
                    (item['image'] != "") ? 
                    <ListItem containerStyle={{color:"#383737"}} key={i} leftAvatar={{ rounded:true, source: { uri: item['image']} }}
                            title={item.name}
                            //subtitle={item.mainArtist}
                            bottomDivider
                        /> : 
                        <ListItem
                            key={i}
                            containerStyle={{backgroundColor:"#30ba7e"}}
                            leftIcon = { !item['image'] ? { size:20,rounded:true, name: "user", type: "font-awesome"} : {}}
                            title={item.name}
                            //subtitle={item.mainArtist}
                            bottomDivider
                        />
                ))}
                </ScrollView>
            </View>
            
        )       
    };
}

