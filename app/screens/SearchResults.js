import React, { Component } from 'react';
import SpotifyWebAPI from 'spotify-web-api-js';
import {getValidSPObj} from '../utils/spotifyFunctions.js';
import { Container, Header, Content, Button, Text, View } from 'native-base';
import Modal from 'react-native-modal';

getSong = async (data) => {
    const sp = await getValidSPObj();
    data = "track:" + data;
    sp.searchTracks(data, {limit: 3, offset: 0, market: "US"} ).then(result => console.log("Song: ", result));
};  

const SearchResults = (props) =>{
    return(
        <View>
            
        </View>
    )
};

export {SearchResults};