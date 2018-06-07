import React, {Component, PureComponent} from 'react'

class Store extends PureComponent {


    render() {
        const {store, onMakeMyStoreClick} = this.props;

        return (
            <div>
                <h2 className="store-title">{store.title}</h2>
                <p className="distance">Distance: {store.distance}</p>
                <p className="store-type">Store type: {store.storeTypeID === 0 ? 'Dealer Store' : 'Independent Store'}</p>

                <button onClick={onMakeMyStoreClick}>
                    Make this my store
                </button>
            </div>
        )
    }

}


export default Store