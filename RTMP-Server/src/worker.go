package main

import (

    "sync"
	"github.com/torresjeff/rtmp"
	"encoding/json"
	"flag"
	"log"
	"net/url"
	"os"
	"os/signal"

	"github.com/torresjeff/rtmp/video"

    "github.com/gorilla/websocket"
)

var addr = flag.String("addr", ":8080", "http service address")

var rtmpClient *rtmp.Client
var isActiveSequence bool

// Sequence
var frameType video.FrameType
var codec video.Codec
var payloadSequence []byte

type GeoData struct {
    Latitude  float64 `json:"lat"`
    Longitude float64 `json:"long"`
}

func OnVideo(frameType video.FrameType, codec video.Codec, payload []byte, timestamp uint32) {
    // print the actual payload
    // for i := 0; i < len(payload); i++ {
    //     log.Printf("Payload[%d]: %x", i, payload[i])
    // }

    if isActiveSequence {
        payloadSequence = append(payloadSequence, payload...)
        log.Printf("Adding payload to sequence: %d bytes in total of %d bytes", len(payload), len(payloadSequence))

    } else {
        payloadSequence = payload
        frameType = frameType
        codec = codec
        log.Printf("Payload sequence started: %d bytes", len(payload))
    }

}

func OnMetadata(metadata map[string]interface{}) {
	log.Printf("client: on metadata: %+v", metadata)
}

func isActive(gd GeoData) bool {
    // TODO: implement logic
    log.Printf("Received GeoData: Latitude: %f, Longitude: %f", gd.Latitude, gd.Longitude)
	return gd.Latitude > 10 && gd.Longitude > 10
}

func connectToRTMP() {
    defer func() { 
        isActiveSequence = false
        disconnectFromRTMP()
    }()
    
    if rtmpClient != nil {
        log.Println("RTMP connection already active")
        return
    }

    rtmpClient = &rtmp.Client{
        OnVideo:    OnVideo,
        OnMetadata: OnMetadata,
    }

    rtmpURL := "rtmp://localhost/app/publish_1"
    log.Printf("Connecting to RTMP server: %s", rtmpURL)

    // Start playing the stream, with OnVideo callback
    err := rtmpClient.Connect(rtmpURL)
    if err != nil {
        log.Printf("Stream disconnected.")
        return
    }
}

func disconnectFromRTMP() {
    if rtmpClient == nil {
        log.Println("RTMP connection is not active")
        return
    }

    log.Println("Stopping RTMP streams and cleaning up resources")
    rtmpClient.Close()
    rtmpClient = nil
}

func getLocation(wg *sync.WaitGroup) {
    defer wg.Done()

    // Ctrl+C handling
    interrupt := make(chan os.Signal, 1)
    signal.Notify(interrupt, os.Interrupt)

    u := url.URL{Scheme: "ws", Host: *addr, Path: "/location"}
    log.Printf("Connecting to WebSocket server at %s", u.String())

    c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
    if err != nil {
        log.Fatal("Error connecting to WebSocket:", err)
    }

    defer c.Close()
    done := make(chan struct{})

    go func() {
        defer close(done)
        for {
            _, message, err := c.ReadMessage()
            if err != nil {
                log.Println("Websocket is closed.")
                return
            }

            var gd GeoData
            if err := json.Unmarshal(message, &gd); err != nil {
                log.Println("Error unmarshalling message.")
                continue
            }
            
            // This logic ensures sequential handling:
            // Example: F F | T T T | F -> Only the sequence of true values (T) triggers RTMP connection.
            
            active := isActive(gd)
            if isActiveSequence {
                if !active {
                    log.Println("Deactivating RTMP connection")
                    isActiveSequence = false
                    disconnectFromRTMP()
                }
            } else {
                if active {
                    log.Println("Activating RTMP connection")
                    isActiveSequence = true
                    go connectToRTMP()
                }
            }

        }
    }()

    for {
        select {
        case <-done:
            log.Println("WebSocket connection closed")
            disconnectFromRTMP()
            return
        case <-interrupt:
            log.Println("Received interrupt signal, shutting down...")
            disconnectFromRTMP()
            return
        }
    }
}

func main() {

    var wg sync.WaitGroup
    wg.Add(1)

    go getLocation(&wg)

    wg.Wait()
}