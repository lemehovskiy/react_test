import React, {PureComponent} from "react"
import Store from "../Store/"
// import './style.css'

export default class StoreList extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            openShopId: props.activeStoreID
        }
    }

    render() {
        const storesElement = this.props.stores.map((store, index) =>
            <li key={store.id} className={store.id === this.state.openShopId ? 'active' : ' '}>
                <Store
                    store={store}
                    onMakeMyStoreClick={this.handleClick.bind(this, store.id)}
                />
            </li>
        )

        return (
            <ul>
                {storesElement}
            </ul>
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