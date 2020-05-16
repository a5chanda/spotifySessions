import io from "socket.io-client";
import { serverURI } from "../config/env";

export const socket = io(serverURI, {transports: ['websocket']});