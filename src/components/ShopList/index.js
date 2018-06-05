import React, {PureComponent} from "react"
import Shop from "../Shop/"
// import './style.css'

export default class ShopList extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            openShopId: null
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

        this.props.onMakeMyStoreClick(openShopId);

        console.log('hand');
        this.setState({
            openShopId: this.state.openShopId === openShopId ? null : openShopId
        })
    }
}