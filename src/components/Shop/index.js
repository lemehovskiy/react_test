import React, {Component, PureComponent} from 'react'

import './style.scss'

class Shop extends PureComponent {


    render() {
        const {shop, onButtonClick} = this.props;

        return (
            <div>
                {shop.title}

                <button onClick={onButtonClick}>Make this my store</button>
            </div>
        )
    }

}


export default Shop