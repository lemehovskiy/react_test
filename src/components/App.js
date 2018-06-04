import React, {Component, PureComponent} from 'react'
import ShopList from './ShopList/'
import shops from '../shops'
import "bootstrap/dist/css/bootstrap.css"

class App extends PureComponent {

    // state = {
    //     reverted: false
    // }

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            location: {}
        };
    }


    componentDidMount() {
        fetch("http://api.ipstack.com/78.137.6.109?access_key=7d397b1c07df95585a1bb05dd8ba894e")
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
    }


    render() {
        const {error, isLoaded, location} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <ul>
                        {location.latitude} {location.longitude}
                    </ul>
                    <ShopList shops={shops}/>
                </div>
            );
        }
    }

    // revert = () => {
    //     this.articles.reverse();
    //
    //     this.setState({
    //         reverted: !this.state.reverted
    //     })
    // }

}

export default App