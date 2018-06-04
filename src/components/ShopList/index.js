import React, {PureComponent} from "react"
import Shop from "../Shop"
// import './style.css'

export default class ShopList extends PureComponent {


    render() {

        const shopsElement = this.props.shops.map((shop, index) =>
            <li key={shop.id}>
                <Shop shop = {shop}/>
            </li>
        )

        return (
            <ul>
                {shopsElement}
            </ul>
        )
    }

    // handleClick = openArticleId => this.setState({
    //     openArticleId: this.state.openArticleId === openArticleId ? null : openArticleId
    // })
}