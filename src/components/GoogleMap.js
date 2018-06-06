import React from "react";
import { compose, withProps ,lifecycle} from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";

const MyMapComponent = compose(
    withProps({
        googleMapURL:
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyAkbu04rf_WBmWQhuo9c5K8DV1jrsK3Hlw&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentWillMount() {

            this.setState({

                zoomToMarkers: map => {
                    //console.log("Zoom to markers");
                    const bounds = new window.google.maps.LatLngBounds();
                    map.props.children.forEach((child) => {
                        if (child.type === Marker) {
                            bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
                        }
                    })
                    map.fitBounds(bounds);
                }
            })
        },
    }),
)(props => (
    <GoogleMap ref={props.zoomToMarkers} defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
        <Marker position={{ lat: -34.397, lng: 150.644 }} />
        <Marker position={{ lat: 49.430647, lng: 32.065539 }} />
    </GoogleMap>
));


const ReactGoogleMaps = () => [
    <MyMapComponent key="map" />
];

export default ReactGoogleMaps;