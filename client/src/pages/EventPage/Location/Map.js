import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import './Map.scss';

const key = 'AIzaSyC6b_38Ikznrhtf5ZB8sBXm3Yl7y7zL8j8';






class MyMapComponent2 extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    componentDidMount() {
        this.update();

        

    }
    componentWillReceiveProps() {
        this.update();
    }

    update() {
        let geocoder = new window.google.maps.Geocoder();


    geocoder.geocode( { 'address': this.props.location }, (results, status) => {
        if (status == 'OK') {
            console.log(results);


let lat = results[0].geometry.location.lat()
let lng = results[0].geometry.location.lng()

this.setState({lat, lng})
        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });


    }

    render() {
        const { lat, lng } = this.state;
        if (!lat || !lng) return null;

        return (
            <GoogleMap
              defaultZoom={12}
              defaultCenter={{ lat: lat, lng: lng }}
            >
              {this.props.isMarkerShown && <Marker position={{ lat: lat, lng: lng }} />}
            </GoogleMap>
          )
    }
}


const MyMapComponent = withScriptjs(withGoogleMap(MyMapComponent2)
)

export default ({location}) => {
    return <MyMapComponent
    isMarkerShown
    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6b_38Ikznrhtf5ZB8sBXm3Yl7y7zL8j8&v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div className="map" style={{ height: `300px` }} />}
    mapElement={<div style={{ height: `100%` }} />}
    location={location}
  />
}


