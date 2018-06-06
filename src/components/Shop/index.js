import React, {Component, PureComponent} from 'react'

import './style.scss'

class Shop extends PureComponent {


    render() {
        const {shop, onMakeMyStoreClick} = this.props;

        return (
            <div>
                {shop.title}
                <p>{shop.distance}</p>
                <p>Store type:</p>{shop.storeTypeID === 0 ? 'Pedego Store' : 'Independent Store'}

                <button onClick={onMakeMyStoreClick}>Make this my store</button>
            </div>
        )
    }

}


export default Shop