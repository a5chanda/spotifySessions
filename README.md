# SyncroSessions

![](https://github.com/a5chanda/spotifySessions/blob/master/app/assets/images/spotifysession.png)

## Inspiration
Often times when we are out driving with friends or family, we typically have to use the driver's phone to control the music through Spotify. This proved to be very tedious as the driver would have to unlock their phone and hand it over to whoever wanted to change the song. Hence, we came up with Syncro, a Spotify session app allowing users to make rooms/sessions where everyone can control the music.

We realized that Spotify does not allow users to interact with each other through the app live. For example, if a group of friends were in a car, they keep passing around the phone connected to the car to change the song. We thought it would be very convenient if anyone was able to play or queue a song from their own phones in a session with friends.

## What it does
Syncro allows Spotify users to create a session with their friends and allow them to queue or play a track on the host's phone. The host's Spotify account will be the only one playing the song, but our app allows other users to add a track from their phone which will later play on the host's phone.

We are currently working on adding functionality to change the host in order to play music from a designated member's phone. Also, we are implementing features to also have synchronous playing so that everyone's phone can play the song in real-time.

## How we built it
The front-end was built by utilizing expo, react-native, react-native elements, and native base. The back-end server was built using socket.io, node.js, express.js.

We leveraged expo-auth-session for the authorization using Spotify's OAuth provider. In addition, we leveraged socket.io to handle real-time event handling between the mobile app and our server.

For Socket.io, we used the room functionality to create channels and mapped each room with a custom Room class containing all our functionality for adding members, queuing songs, and playing songs.

## Challenges we ran into
We ran into some issues using Spotify's web API when it came to storing the authorization and expiration tokens for each individual member in the session. OAuth was difficult since we had to ensure that the authorization tokens were being stored properly so we could make Spotify API calls in later components.

Also, we struggled a little bit with handling state management between parent and child components in react-native and eventually figured out that we needed to use bind and callbacks between the parent and child according to React documentation.
