import React, {Component, PureComponent} from 'react'

import './style.scss'

class Store extends PureComponent {


    render() {
        const {store, onMakeMyStoreClick} = this.props;

        return (
            <div>
                {store.title}
                <p>{store.distance}</p>
                <p>Store type:</p>{store.storeTypeID === 0 ? 'Dealer Store' : 'Independent Store'}

                <button onClick={onMakeMyStoreClick}>Make this my store</button>
            </div>
        )
    }

}


export default Store