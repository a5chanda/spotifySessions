import React, { Component } from 'react';
import SpotifyWebAPI from 'spotify-web-api-js';
import {getValidSPObj, makeSong} from '../utils/spotifyFunctions.js';
import { Container, Header, Content, Button, Text, View } from 'native-base';
import Modal from 'react-native-modal';
import {ListItem, SearchBar} from 'react-native-elements';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

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
            <View>  
                <ScrollView>
                {this.props.members.map((item, i) => (
                    <TouchableOpacity key={i} onPress={() => {console.log(item); this.handleChange(item)}}>
                        <ListItem
                            key={i}
                            // leftAvatar={{ rounded:false, source: { uri: item['albumArt'][0]['url']} }}
                            title={item}
                            //subtitle={item.mainArtist}
                            bottomDivider
                        />
                    </TouchableOpacity>
                ))}
                </ScrollView>
            </View>
            
        )       
    };
}

