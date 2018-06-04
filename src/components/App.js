import React, {Component, PureComponent} from 'react'
import ShopList from './ShopList/'
import shops from '../shops'
import "bootstrap/dist/css/bootstrap.css"
import {getDistanceFromLatLon} from './GetDistanceFromLatLon';

const _ = require('lodash');


class App extends PureComponent {

    // state = {
    //     reverted: false
    // }

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            isIpLoaded: false,
            ip: null,
            location: {}
        };
    }


    componentDidMount() {

        fetch("https://json.geoiplookup.io/api")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isIpLoaded: true,
                        ip: result.ip
                    });

                    const {ip} = this.state;

                    fetch("http://api.ipstack.com/" + ip + "?access_key=7d397b1c07df95585a1bb05dd8ba894e")
                        .then(res => res.json())
                        .then(
                            (result) => {
                                this.setState({
                                    isLoaded: true,
                                    location: {latitude: result.latitude, longitude: result.longitude}

                                });
                            },
                            // Note: it's important to handle errors here
                            // instead of a catch() block so that we don't swallow
                            // exceptions from actual bugs in components.
                            (error) => {
                                this.setState({
                                    isLoaded: true,
                                    error
                                });
                            }
                        )
                },

                (error) => {
                    this.setState({
                        isIpLoaded: true,
                        error
                    });
                }
            )
    }


    render() {
        const {error, isLoaded, isIpLoaded, ip, location} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded && !isIpLoaded) {
            return <div>Loading...</div>;
        } else {

            return (

                <div>
                    <p>
                        Your ip: {ip}
                    </p>
                    <p>
                        Your location: {location.latitude} {location.longitude}
                    </p>

                    <p>
                        Your shop: <ShopList shops={this.getNearestShops(shops, 1)}/>
                    </p>

                </div>
            );
        }
    }


    getNearestShops = (shops, num) => {

        const {location} = this.state;

        let sortedShops = shops;

        sortedShops.forEach(function (shop) {
            shop.distance = getDistanceFromLatLon(location.latitude, location.longitude, shop.lat, shop.lng);
        })

        return _.sortBy(sortedShops, ['distance']).slice(0, num);
    }

}

export default App