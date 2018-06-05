import React, {Component, PureComponent} from 'react'

import './style.scss'

class Shop extends PureComponent {


    render() {
        const {shop, onMakeMyStoreClick} = this.props;

        return (
            <div>
                {shop.title}
                <p>{shop.distance}</p>

                <button onClick={onMakeMyStoreClick}>Make this my store</button>
            </div>
        )
    }

}


export default Shop