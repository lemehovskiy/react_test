import React, {PureComponent} from "react"
import Store from "../Store"
import './style.scss'


export default class StoreList extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            openStoreId: props.activeStoreID
        }
    }

    render() {
        const storesElement = this.props.stores.map((store, index) =>
            <li key={store.id} className={store.id === this.state.openStoreId ? 'active' : ' '}>
                <Store
                    store={store}
                    onMakeMyStoreClick={this.handleClick.bind(this, store.id)}
                />
            </li>
        )

        return (
            <div>
                <h3>Nearest stores:</h3>

                <ul className="nearest-stores">
                    {storesElement}
                </ul>
            </div>
        )
    }

    handleClick(openStoreId) {

        if (this.state.openStoreId === openStoreId) {
            return;
        }

        this.props.onMakeMyStoreClick(openStoreId);

        // console.log('handleClick');

        this.setState({
            openStoreId: openStoreId
            // openShopId: this.state.openShopId === openShopId ? null : openShopId
        })
    }
}