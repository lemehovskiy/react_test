import React, {Component, PureComponent} from 'react'

class Shop extends PureComponent {


    render() {
        const {shop} = this.props;

        return (
            <div className="shop">
                <h2>
                    {shop.title}
                </h2>
            </div>
        )
    }

}


export default Shop