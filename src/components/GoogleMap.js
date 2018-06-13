import React, {Component} from "react"
import {compose} from "recompose"
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps"

const _ = require('lodash');

const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {

    const {onMapMounted, ...otherProps} = props;

    return (
        <GoogleMap {...otherProps} ref={c => {
            onMapMounted && onMapMounted(c)
        }}>
            {props.stores.map(store => {
                const onClick = props.onClick.bind(this, store)
                {/*console.log(props.stores);*/
                }
                return (
                    <Marker
                        key={store.id}
                        onClick={onClick}
                        position={{lat: store.lat, lng: store.lng}}
                        icon={{
                            path: 'M10.9,0C4.9,0,0,4.9,0,10.9c0,7,9.8,24.7,10.9,24.7c1.2,0,10.9-17.5,10.9-24.7C21.8,4.9,16.9,0,10.9,0z M10.9,15.5c-2.5,0-4.6-2-4.6-4.6s2-4.6,4.6-4.6c2.5,0,4.6,2,4.6,4.6S13.4,15.5,10.9,15.5z',
                            fillColor: store.storeTypeID === 1 ? '#882929' : '#000000',
                            fillOpacity: 1,
                            scale: 1.1,
                            strokeWeight: 0,
                        }}
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
        super(props)

        this.state = {
            stores: props.stores,
            selectedMarker: false
        }
    }

    componentWillReceiveProps(nextProps) {

        // You don't have to do this check first, but it can help prevent an unneeded render
        if (!(_.isEqual(nextProps.stores, this.state.stores))) {

            console.log('componentWillReceiveProps');

            this.zoomAndCenter(nextProps.stores)
        }
    }

    componentDidMounted(){
        console.log('componentDidMounted');
    }

    zoomAndCenter(stores) {
        const bounds = new window.google.maps.LatLngBounds();

        stores.forEach((store) => {
            bounds.extend(new window.google.maps.LatLng(store.lat, store.lng));
        })
        this._mapRef.fitBounds(bounds);

        this.setState({stores: stores});
    }

    handleMapMounted = (c) => {
        if (!c || this._mapRef) return;
        this._mapRef = c;

        this.zoomAndCenter(this.state.stores);
    };

    handleClick(marker, event) {
        // console.log({ marker })
        this.setState({selectedMarker: marker})
    }

    render() {
        return (
            <MapWithAMarker
                selectedMarker={this.state.selectedMarker}
                stores={this.state.stores}
                onClick={this.handleClick.bind(this)}
                // zoomToMarkers={this.state.zoomToMarkers}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAkbu04rf_WBmWQhuo9c5K8DV1jrsK3Hlw&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{height: `100%`}}/>}
                containerElement={<div style={{height: `400px`}}/>}
                mapElement={<div style={{height: `100%`}}/>}
                onMapMounted={this.handleMapMounted.bind(this)}
                // onBoundsChanged={this.handleBoundsChanged}
                defaultZoom={8}
                defaultCenter={{lat: this.state.stores[0].lat, lng: this.state.stores[0].lng}}
            />

        );
    }
}