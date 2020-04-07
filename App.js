import React from 'react'
import { View, StyleSheet, Text, Button, Image } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; 


export default class App extends React.Component {

  state = {
    message: '',
    myCoordinate: {
      latitude: -6.6204897,
      longitude: 106.8163102,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    },
    coodinates: [
      {
        latitude: -6.6215897,
        longitude: 106.8233102
      },
      {
        latitude: -6.6202897,
        longitude: 106.8144102
      },
      {
        latitude: -6.6254897,
        longitude: 106.8163102
      }
    ]
  }

  handleMove = () => {
    this.refs.map.animateToRegion({
      latitude: -6.3729921,
      longitude: 106.8322328,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 3000)
  }

  handleShow = () => {
    this.setState({ message: 'Sekardayu Hana Pradiani' })
  }

  calculateMiddleCoordinate = (coordinates) => {
    const arrOfLatitude = this.state.coodinates.map(coordinate => coordinate.latitude)
    const arrOfLongitude = this.state.coodinates.map(coordinate => coordinate.longitude)

    const minLat = Math.min(...arrOfLatitude)
    const maxLat = Math.max(...arrOfLatitude)

    const minLong = Math.min(...arrOfLongitude)
    const maxLong = Math.max(...arrOfLongitude)
    console.log(`MIN LATITUDE: ${minLat}, MAX LATITUDE : ${maxLat}, MIN LONGITUDE: ${minLong}, MAX LONGITUDE: ${maxLong}`)

    return {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLong + minLong) / 2,
      latitudeDelta: Math.abs(maxLat - minLat) + 0.002,
      longitudeDelta: Math.abs(maxLong - minLong) + 0.002 
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={this.calculateMiddleCoordinate(this.state.coodinates)}
        >
          { this.state.coodinates.map((coordinate, i) => {
            return (
              <Marker
                key={i}
                title="I am here"
                coordinate={{
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude
                }}
                description="Hey Jude, don't make it bad. Take a sad song, don't make it better!"
                onPress={this.handleShow}
              >
                <Image 
                  source={{ uri: 'https://www.dovercourt.org/wp-content/uploads/2019/11/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.jpg' }}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 50 / 2,
                    borderWidth: 2,
                    borderColor: 'pink'
                  }}
                />
              </Marker>
            )
          }) }
        </MapView>
        <Button title="Pindah" onPress={this.handleMove}/>
        <Text>{this.state.message}</Text>
      </View>
    )
  }
};


const styles = StyleSheet.create({
  container: {},
  map: {
    height: 400,
    width: '100%'
  },
 });