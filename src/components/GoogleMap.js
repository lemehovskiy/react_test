import React, { Component } from "react"
import { compose } from "recompose"
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps"

const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {

    return (
        <GoogleMap ref={props.zoomToMarkers} defaultZoom={8} defaultCenter={{ lat: 29.5, lng: -95 }}>
            {props.stores.map(store => {
                const onClick = props.onClick.bind(this, store)
                console.log(props);
                return (
                    <Marker
                        key={store.id}
                        onClick={onClick}
                        position={{ lat: store.lat, lng: store.lng }}
                    >
                        {props.selectedMarker === store &&
                        <InfoWindow>
                            <div>
                                {store.title}
                            </div>
                        </InfoWindow>
                        }
                    </Marker>
                )
            })}
        </GoogleMap>
    )
})

export default class ShelterMap extends Component {
    constructor(props) {
        console.log(props);
        super(props)
        this.state = {
            stores: props.stores,
            selectedMarker: false
        }
    }
    componentWillMount() {

        this.setState({

            zoomToMarkers: map => {
                const bounds = new window.google.maps.LatLngBounds();
                map.props.children.forEach((child) => {
                    if (child.type === Marker) {
                        bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
                    }
                })
                map.fitBounds(bounds);
            }
        })
    }
    handleClick (marker, event) {
        // console.log({ marker })
        this.setState({ selectedMarker: marker })
    }
    render() {
        return (
            <MapWithAMarker
                selectedMarker={this.state.selectedMarker}
                stores={this.state.stores}
                onClick={this.handleClick.bind(this)}
                zoomToMarkers={this.state.zoomToMarkers}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAkbu04rf_WBmWQhuo9c5K8DV1jrsK3Hlw&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        )
    }
}