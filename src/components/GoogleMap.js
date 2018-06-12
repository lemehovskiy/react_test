import React, { Component } from "react"
import { compose , withProps, withState, withHandlers } from "recompose"
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,

} from "react-google-maps"

const MapWithAMarker = compose(
    withState('zoom', 'onZoomChange', 12),
    withHandlers(() => {
        const refs = {
            map: undefined,
        }

        return {
            onMapMounted: () => ref => {
                refs.map = ref
                console.log('onMapMounted')
            },
            onZoomChanged: ({ onZoomChange }) => () => {
                onZoomChange(refs.map.getZoom(
                    console.log('onZoomChanged')
                ))
            }
        }
    }),
    withScriptjs,
    withGoogleMap)
    (props => {
    return (
        <GoogleMap
            zoom={props.zoom}
            ref={props.onMapMounted}
            onZoomChanged={props.onZoomChanged}
            zoomToMarkers={props.zoomToMarkers}
            defaultCenter={{ lat: props.stores[0].lat, lng: props.stores[0].lng }}>
            {props.stores.map(store => {
                const onClick = props.onClick.bind(this, store)
                {/*const zoomToMarkers = props.zoomToMarkers.bind(this.store)*/}

                return (
                    <Marker
                        key={store.id}
                        onClick={onClick}
                        position={{ lat: store.lat, lng: store.lng }}
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
            selectedMarker: false,
            markers: [],
            zoomToMarkers: {},
            onZoomChange: {}
        }

    }
    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.stores !== this.state.stores) {
            this.setState({ stores: nextProps.stores });
        }
    }

    componentWillMount() {
        console.log('componentWillMount method')
        this.setState({ markers: [] })
    }

    componentDidMount() {
        console.log('componentDidMount method')
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
        console.log('handleClick method')
        // console.log({ marker })
        this.setState({ selectedMarker: marker })

    }
    render() {
        console.log('render method')
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