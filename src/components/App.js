import React, {Component, PureComponent} from 'react'
import ShopList from './ShopList/'
import MyShop from './MyShop'
import shops from '../shops'
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
            isLocationLoaded: false,
            isIpLoaded: false,
            isStoresLoaded: false,
            dataLoaded: false,
            ip: null,
            location: {},
            my_shop: null,
            shops: []
        };

        this.storageKey = 'pedegoMyStore';
    }

    componentDidMount() {

        let promiseArr = [];

        promiseArr.push(new Promise((resolve, reject) => {
            setTimeout(() => {
                this.setState({
                    shops: shops
                })
                resolve("Shops loaded");
            }, 1000);

        }));


        if (this.getStorageData() === null) {
            promiseArr.push(fetch("https://json.geoiplookup.io/api")
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            ip: result.ip
                        });

                        const {ip} = this.state;

                        return fetch("http://api.ipstack.com/" + ip + "?access_key=7d397b1c07df95585a1bb05dd8ba894e")
                            .then(res => res.json())
                            .then(
                                (result) => {
                                    this.setUserLocation({latitude: result.latitude, longitude: result.longitude});

                                    return result;
                                    // this.setNearestShops();
                                },
                                // Note: it's important to handle errors here
                                // instead of a catch() block so that we don't swallow
                                // exceptions from actual bugs in components.
                                (error) => {
                                    this.setState({
                                        isLocationLoaded: true,
                                        error
                                    });
                                }
                            )
                    },

                    (error) => {
                        this.setState({
                            error
                        });
                    }
                )
            )
        }

        else {
            let location = this.getStorageData();

            this.setState({
                location: {latitude: location.latitude, longitude: location.longitude}
            });

        }

        Promise.all(promiseArr).then(values => {

            this.setShopDistance();
            this.sortShopByDistance();
            this.setMyStore(this.state.shops[0]);

            this.setState({
                dataLoaded: true
            })

            this.pushToStorage();
            // console.log(values);

            // console.log(this.state.shops);
        });


    }

    pushToStorage(){

        let storageData = {
            location: this.state.location,
            my_shop: this.my_shop
        }

        sessionStorage.setItem(this.storageKey, JSON.stringify(this.state.location));
    }

    setUserLocation(location){
        this.setState({
            location: {latitude: location.latitude, longitude: result.longitude}
        });
    }

    setNearestShops() {
        this.state.nearest_shops = this.getNearestShops(shops);

        // console.log('asdf');

        console.log(this.state.nearest_shops);
    }

    render() {
        const {error, dataLoaded, ip, location, nearest_shops} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!dataLoaded) {
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

                    <MyShop shop={this.state.my_shop}/>

                    Nearest shops:
                    <ShopList shops={this.state.shops}/>

                </div>


            );
        }
    }



    setMyStore(store){

        this.state.my_shop = store;
    }

    setShopDistance() {
        const {location, shops} = this.state;

        shops.forEach(function (shop) {
            shop.distance = getDistanceFromLatLon(location.latitude, location.longitude, shop.lat, shop.lng);
        })
    }

    sortShopByDistance(){
        this.state.shops = _.sortBy(this.state.shops, ['distance'])
    }


    getNearestShops(shops, num) {

        const {location} = this.state;

        let sortedShops = shops;

        console.log(sortedShops);

        sortedShops.forEach(function (shop) {
            shop.distance = getDistanceFromLatLon(location.latitude, location.longitude, shop.lat, shop.lng);
        })

        console.log(_.sortBy(sortedShops, ['distance']));

        return _.sortBy(sortedShops, ['distance']);
    }

    getStorageData() {
        return JSON.parse(sessionStorage.getItem(this.storageKey));
    }

}

export default App