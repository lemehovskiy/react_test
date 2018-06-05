import React, {PureComponent} from "react"

export default class MyShop extends PureComponent {

    render() {

        return (
            <div>
                {this.props.shop.title}
            </div>
        );
    }
}