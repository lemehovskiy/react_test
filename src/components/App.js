import React, {Component, PureComponent} from 'react'
import StoreList from './StoreList/'
import MyStore from './MyStore'
import stores from '../stores'
import {getDistanceFromLatLon} from './GetDistanceFromLatLon';
import Select from "react-select";
import 'react-select/dist/react-select.css';

import MapWithAMarker from './GoogleMap';
import Search from "./Search";


const _ = require('lodash');


class App extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            dataLoaded: false,
            ip: null,
            location: {},
            myStore: null,
            searchVal: null,
            stores: [],
            filteredStores: [],
            userForceCheckStore: false,
            markerOffset: 2,
            dealerListOffset: 2,


            showMoreVal: 1,

            filters: [
                {
                    name: 'distance',
                    val: null
                },
                {
                    name: 'storeType',
                    val: null
                }
            ]
        };

        this.promiseArr = [];
        this.storageKey = 'myStore';
    }

    handleFilterChange(filterName) {

        let self = this;

        let currentFilters = this.state.filters;

        return function (filterVal) {
            currentFilters.forEach(function (filter) {
                if (filter.name === filterName) {
                    filter.val = filterVal.value;

                    self.setState({
                        filters: currentFilters
                    }, function () {
                        this.filterStores();
                    })
                }
            })
        }.bind(this);
    }

    filterStores() {
        let self = this;

        let filteredStores = this.state.stores;

        // this.state.filters.forEach(function (filter) {
        //     if (filter.val === null || filter.val === -1) return;
        //
        //     if (filter.name === 'distance') {
        //         filteredStores = _.filter(filteredStores, function (item) {
        //             return item.distance < filter.val
        //         })
        //     }
        //
        //     else if (filter.name === 'storeType') {
        //         filteredStores = _.filter(filteredStores, function (item) {
        //             return item.storeTypeID === filter.val
        //         })
        //     }
        // })

        if (!(this.state.searchVal === null)) {
            filteredStores = filteredStores.filter(function (store) {
                let searchStr = store.title.toLowerCase() + ' ' + store.address.toLowerCase() + ' ' + store.zip;
                return searchStr.search(self.state.searchVal.toLowerCase()) !== -1;
            });
        }


        self.setState({
            filteredStores: filteredStores
        })
    }

    handleSearchInput(event) {
        this.setState({
            searchVal: event.target.value
        }, function () {
            this.filterStores();
        })
    }

    componentDidMount() {

        let storageData = this.getStorageData();

        this.promiseArr.push(this.getStores());

        //check is storage exist
        if (storageData !== null) {
            this.pullFromStorage();

            //check if location in storage is empty
            if (storageData.location.latitude === null || storageData.location.longitude === null) {
                this.promiseArr.push(this.setUserLocation())
            }
        }

        // if storage empty - get location
        else {
            this.promiseArr.push(this.setUserLocation())
        }


        // console.log('1');
        //
        // console.log(this.state)

        Promise.all(this.promiseArr).then(values => {

            console.log('promiseAll');

            this.setStoreDistance();
            this.sortStoreByDistance();
            this.initFilteredStores();

            if (!this.state.userForceCheckStore) {
                this.setMyStore(this.state.stores[0].id);
            }

            this.setState({
                dataLoaded: true
            })

            this.pushToStorage();
        },
            reason => {
                console.log(reason)

                // console.log(this.state);

                this.initFilteredStores();
                this.setMyStore(this.state.stores[0].id);

                this.setState({
                    dataLoaded: true
                })

            });
    }


    getLocation() {

        let self = this;

        console.log('getLocation');

        return new Promise(function (resolve, reject) {

            self.getLocationByIp().then(response => {

                if (response.city === null) {

                    console.log('city is null');

                    self.getLocationByCurrentPosition().then(response => {
                        resolve(response);
                    })
                }

                else {
                    return resolve({latitude: response.latitude, longitude: response.longitude});
                }
            })
        })

    }

    getLocationByCurrentPosition() {

        console.log('getLocationByCurrentPosition');

        return new Promise(function (resolve, reject) {

            navigator.geolocation.getCurrentPosition(function (position) {

                resolve({latitude: position.coords.latitude, longitude: position.coords.longitude});

            }, function () {
                reject('Error: The Geolocation service failed.')
            });

        });
    }

    getLocationByIp() {

        let self = this;

        console.log('getLocationByIp')

        return fetch("https://jsonip.com/")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        ip: result.ip
                    });
                    // alert('asd');

                    const {ip} = this.state;
                    // const ip = '37.73.134.205';


                    return fetch("http://api.ipstack.com/" + ip + "?access_key=7d397b1c07df95585a1bb05dd8ba894e")
                        .then(res => res.json())
                        .then(
                            (result) => {
                                return result;
                            },
                            (error) => {
                                return error;
                            }
                        )
                },

                (error) => {
                    return error;
                }
            )
    }


    setUserLocation() {

        let self = this;

        console.log('setUserLocation');


        return new Promise(function (resolve, reject) {

            self.getLocation().then(response => {


                console.log(response);

                self.setState({
                    location: response
                }, function(){
                    resolve();
                });

            })

        });
    }

    getStores() {
        console.log('getStores');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.setState({
                    stores: stores
                })
                resolve("Stores loaded");
            }, 1000);

        })
    }

    initFilteredStores() {

        this.setState({
            filteredStores: this.state.stores
        })
    }

    pullFromStorage() {
        let storageData = this.getStorageData();

        this.setState({
            location: storageData.location,
            myStore: storageData.myStore,
            userForceCheckStore: storageData.userForceCheckStore
        });
    }

    pushToStorage() {
        let storageData = {
            location: this.state.location,
            myStore: this.state.myStore,
            userForceCheckStore: this.state.userForceCheckStore
        }

        // sessionStorage.setItem(this.storageKey, JSON.stringify(storageData));
    }

    setMyStore(storeID) {
        let self = this;

        this.state.stores.forEach(function (store) {
            if (store.id === storeID) {
                self.setState({
                    myStore: store
                }, () => self.pushToStorage());
            }
        })
    }

    onMakeMyStoreClick(storeID) {

        this.state.userForceCheckStore = true;
        this.setMyStore(storeID);
    }

    setStoreDistance() {
        const {location, store} = this.state;

        stores.forEach(function (store) {
            store.distance = getDistanceFromLatLon(location.latitude, location.longitude, store.lat, store.lng);
        })
    }

    sortStoreByDistance() {
        this.state.stores = _.sortBy(this.state.stores, ['distance'])
    }


    getStorageData() {
        return JSON.parse(sessionStorage.getItem(this.storageKey));
    }

    showMoreMarkersAndDealerList() {

        this.setState({
            markerOffset: this.state.markerOffset + this.state.showMoreVal,
            dealerListOffset: this.state.dealerListOffset + this.state.showMoreVal
        })
    }


    render() {
        const {error, dataLoaded, ip, location, distanceFilterVal} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!dataLoaded) {
            return <div>Loading...</div>;
        } else {

            return (

                <div>
                    <MapWithAMarker isMarkerShown={true}
                                    stores={this.state.filteredStores.slice(0, this.state.markerOffset)}/>


                    <div id="find-store-debug">

                        <h3>
                            Debug info
                        </h3>
                        <p>
                            Your ip: {ip}
                        </p>

                        <p>
                            Your location: {location.latitude} {location.longitude}
                        </p>

                        <div>
                            Your store: <MyStore store={this.state.myStore}/>
                        </div>
                    </div>


                    <Search
                        handleSearchInput={this.handleSearchInput.bind(this)}/>


                    <StoreList
                        stores={this.state.filteredStores.slice(0, this.state.dealerListOffset)}
                        activeStoreID={this.state.myStore.id}
                        onMakeMyStoreClick={this.onMakeMyStoreClick.bind(this)}

                    />


                    <button onClick={this.showMoreMarkersAndDealerList.bind(this)}>
                        Show more
                    </button>


                </div>


            );
        }
    }

}

export default App