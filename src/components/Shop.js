import React, {Component, PureComponent} from 'react'

class Shop extends PureComponent {


    render() {
        const {shop} = this.props;

        return (
            <div>
                    {shop.title}
            </div>
        )
    }

}


export default Shop