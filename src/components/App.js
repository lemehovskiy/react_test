import React, {Component, PureComponent} from 'react'
import ShopList from './ShopList/'
import MyShop from './MyShop'
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
            location: {},
            my_shop: null
        };

        this.storageKey = 'pedegoMyStore';
    }


    componentDidMount() {

        if (this.getStorageLocation() === null) {

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

                                    sessionStorage.setItem(this.storageKey, JSON.stringify(this.state.location));

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

        else {
            let location = this.getStorageLocation();

            this.setState({
                isLoaded: true,
                location: {latitude: location.latitude, longitude: location.longitude}
            });
        }
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

                    My shop:
                    <MyShop shops={this.getNearestShops(shops, 1)}/>

                    Nearest shops:
                    <ShopList shops={this.getNearestShops(shops, 4)}/>

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

    getStorageLocation() {
        return JSON.parse(sessionStorage.getItem(this.storageKey));
    }

}

export default App