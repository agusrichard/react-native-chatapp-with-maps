import React from 'react'
import { View, StyleSheet, Text, TextInput, Button, Image, FlatList } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { db } from './src/config/firebase'


export default class App extends React.Component {

  state = {
    name: '',
    latitude: '',
    longitude: '',
    message: '',
    data: [],
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

  listenData = () => {
    let itemsRef = db.ref('/data-name')
    itemsRef.on('value', res => {
      let data = res.val()
      const objectArray = Object.values(data)
      this.setState({data: objectArray})
    })
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

  addData = (name, latitude, longitude) => {
    try {
      db.ref('/data-name').push({
        name,
        latitude,
        longitude
      })
    } catch(error) {
      console.log(error)
    }
  }

  handleSend = () => {
    const { name, latitude, longitude } = this.state
    this.addData(name, parseFloat(latitude), parseFloat(longitude))
    this.setState({name: '', latitude: '', longitude: ''})
  }

  calculateMiddleCoordinate = (persons) => {
    console.log('calculateMiddleCoordinate')
    console.log(persons)
    persons.forEach((person, i) => console.log(i, person))
    const arrOfLatitude = persons.map(person => person.latitude)
    const arrOfLongitude = persons.map(person => person.longitude)

    console.log(arrOfLongitude)

    const minLat = Math.min(...arrOfLatitude)
    const maxLat = Math.max(...arrOfLatitude)

    const minLong = Math.min(...arrOfLongitude)
    const maxLong = Math.max(...arrOfLongitude)
    console.log(`MIN LATITUDE: ${minLat}, MAX LATITUDE : ${maxLat}, MIN LONGITUDE: ${minLong}, MAX LONGITUDE: ${maxLong}`)

    // console.log('middle',{
    //   latitude: (maxLat + minLat) / 2,
    //   longitude: (maxLong + minLong) / 2,
    //   latitudeDelta: Math.abs(maxLat - minLat) + 0.002,
    //   longitudeDelta: Math.abs(maxLong - minLong) + 0.002
    // })

    return {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLong + minLong) / 2,
      latitudeDelta: Math.abs(maxLat - minLat),
      longitudeDelta: Math.abs(maxLong - minLong)
    }
  }

  componentDidMount() {
    this.listenData()
  }

  render() {
    console.log('render')
    this.state.data.forEach(person => console.log(person))
    let middleCoordinate
    if (this.state.data.length === 0) {
      middleCoordinate = this.state.myCoordinate
    } else {
      middleCoordinate = this.calculateMiddleCoordinate(this.state.data)
    }

    console.log('middleCoordinate', middleCoordinate)

    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={middleCoordinate}
        >
          <Marker
            title="I am here"
            coordinate={{
              latitude: this.state.myCoordinate.latitude,
              longitude: this.state.myCoordinate.longitude
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

          { this.state.data.map(person => (
            <Marker
            title="I am here"
            coordinate={{
              latitude: person.latitude,
              longitude: person.longitude
            }}
          />
          )) }
          
        </MapView>
        <View style={{ flexDirection: 'row' }}>
          <TextInput 
            style={{ flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: 'purple', borderRadius: 5, marginHorizontal: 5 }}
            placeholder="Name"
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
          />
          <TextInput 
            style={{ flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: 'purple', borderRadius: 5, marginHorizontal: 5 }}
            placeholder="Latitude"
            onChangeText={(latitude) => this.setState({latitude})}
            value={this.state.latitude}
          />
          <TextInput 
            style={{ flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: 'purple', borderRadius: 5, marginHorizontal: 5 }}
            placeholder="Longitude"
            onChangeText={(longitude) => this.setState({longitude})}
            value={this.state.longitude}
          />
        </View>
        <Button title="Send" onPress={this.handleSend}/>
        <FlatList 
          data={this.state.data}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => <Text>{index + 1} {item.name}</Text>}
        />
      </View>
    )
  }
};


const styles = StyleSheet.create({
  container: {},
  map: {
    height: 300,
    width: '100%'
  },
 });