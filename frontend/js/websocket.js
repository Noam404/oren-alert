import $ from 'jquery';

export class WebSocketClient {
    constructor(url, main_alert) {
        this.url = url;
        this.dom = main_alert;
    }

    connect() {
        const websocket = new WebSocket(this.url);

        websocket.onopen = () => {
            console.log("Connection established");
        };

        websocket.onmessage = (event) => {
            console.log(event)
            $("ul").append( $("<li>",{
                text: event.data
            }))
        };
    }
}

// const client = new WebSocketClient("ws://localhost:8000/ws");
// client.connect();