import React, {Component, PureComponent} from 'react'
import StoreList from './StoreList/'
import MyStore from './MyStore'
import stores from '../stores'
import {getDistanceFromLatLon} from './GetDistanceFromLatLon';
import Select from "react-select";
import 'react-select/dist/react-select.css';

import MapWithAMarker from './GoogleMap';
import Search from "./Search";

var ReactDOM = require('react-dom');
const _ = require('lodash');


class App extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            locationDetected: false,
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
            dealerListOffset: 3,
            isLoadingMore: false,


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

        window.addEventListener('scroll', this.handleScroll.bind(this));

        let setUserLocationResolve = function (resolve){
            console.log('setUserLocationPromise response');

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
        }

        let setUserLocationReject = function(reject){
            console.log('setUserLocationPromise error');

            this.initFilteredStores();
            this.setMyStore(this.state.stores[0].id);

            this.setState({
                dataLoaded: true
            })
        }

        this.getStores().then(
            response => {
                console.log('getStores response');

                //check is storage exist
                if (storageData !== null) {
                    this.pullFromStorage();

                    //check if location in storage is empty
                    if (storageData.location.latitude === null || storageData.location.longitude === null) {
                        this.setUserLocation().then(setUserLocationResolve.bind(this), setUserLocationReject.bind(this));
                    }
                }
                // if storage empty - get location
                else {
                    this.setUserLocation().then(setUserLocationResolve.bind(this), setUserLocationReject.bind(this));
                }

            },
            error => {
            }
        )


    }


    getLocation() {

        let self = this;

        console.log('getLocation');

        return new Promise(function (resolve, reject) {

            let getLocationReject = reject;

            self.getLocationByIp().then(
                function (result) {
                    if (result.city === null) {

                        console.log('city is null');

                        self.getLocationByCurrentPosition().then(
                            response => {
                                resolve(response)
                            },
                            reject => {
                                getLocationReject(reject)

                            }
                        )
                    }

                    else {
                        return resolve({latitude: response.latitude, longitude: response.longitude});
                    }

                }, function (error) {

                }
            )
        })

    }

    getLocationByCurrentPosition() {

        let self = this;

        console.log('getLocationByCurrentPosition');

        return new Promise(function (resolve, reject) {
            reject('Error: The Geolocation service failed.')

            navigator.geolocation.getCurrentPosition(function (position) {

                resolve({latitude: position.coords.latitude, longitude: position.coords.longitude});

            }, function () {
                // console.log('reject');
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

                    // const {ip} = this.state;
                    const ip = '37.73.134.205';


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
            let setUserLocationReject = reject;

            self.getLocation().then(
                response => {
                    self.setState({
                        location: response
                    }, function () {
                        resolve();
                    });
                },
                reject => {
                    console.log('location not found');
                    setUserLocationReject(reject);
                    // reject(reject);
                }
            )

        });
    }

    getStores() {
        console.log('getStores');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.setState({
                    stores: stores
                }, function () {
                    // console.log('Stores saved');
                    // console.log(this.state);
                    resolve("Stores loaded");
                })
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

    handleScroll(){
        // console.log(window.scrollY);
        if (this.state.isLoadingMore) return;

        let trigger = ReactDOM.findDOMNode(this.refs['StoreList']).getBoundingClientRect().bottom - window.innerHeight;

        let bottomDistance = trigger - 20;

        // console.log(offset);
        if (bottomDistance < 0){
           this.setState({
               dealerListOffset: this.state.dealerListOffset + this.state.showMoreVal
           })
        }


        // return target.scrollTop + clientHeight >= 0.8 * target.scrollHeight;
    }

    render() {
        const {error, dataLoaded, ip, location, distanceFilterVal} = this.state;

        let storesOnMap = this.state.locationDetected ? this.state.filteredStores.slice(0, this.state.markerOffset) : this.state.filteredStores;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!dataLoaded) {
            return <div>Loading...</div>;
        } else {

            return (

                <div>
                    <MapWithAMarker isMarkerShown={true}
                                    stores={storesOnMap}/>


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
                        ref="StoreList"
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