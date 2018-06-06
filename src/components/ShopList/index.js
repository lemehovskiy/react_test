import React, {PureComponent} from "react"
import Shop from "../Shop/"
// import './style.css'

export default class ShopList extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            openShopId: props.activeStoreID
        }
    }

    render() {
        const shopsElement = this.props.shops.map((shop, index) =>
            <li key={shop.id} className={shop.id === this.state.openShopId ? 'active' : ' '}>
                <Shop
                    shop={shop}
                    onMakeMyStoreClick={this.handleClick.bind(this, shop.id)}
                />
            </li>
        )

        return (
            <ul>
                {shopsElement}
            </ul>
        )
    }

    handleClick(openShopId) {

        if (this.state.openShopId === openShopId) {
            return;
        }

        this.props.onMakeMyStoreClick(openShopId);

        console.log('hand');
        this.setState({
            openShopId: openShopId
            // openShopId: this.state.openShopId === openShopId ? null : openShopId
        })
    }
}