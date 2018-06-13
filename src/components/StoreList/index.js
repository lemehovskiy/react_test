import React, {PureComponent} from "react"
import Store from "../Store"
import './style.scss'



export default class StoreList extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            openStoreId: props.activeStoreID,
            stores: [],
            itemsToShow: 3,
            expanded: false
        }
        this.showMore = this.showMore.bind(this);
    }
    componentDidMount() {
        console.log('--componentDidMount')
    }
    showMore() {
        this.setState((prevState, props) => {
            if (prevState.itemsToShow >= props.stores.length){
                return {itemsToShow: 3 , expanded: false}
            }else{
                if (prevState.itemsToShow + 2 >= props.stores.length) {
                    return {itemsToShow: prevState.itemsToShow + 2, expanded: true}
                } else {
                    return {itemsToShow: prevState.itemsToShow + 2, expanded: false}
                }
            }
        })
    }
    render() {

        const storesElement = this.props.stores.slice(0, this.state.itemsToShow).map((store, index) =>
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
                <button className="btn btn-primary" onClick={this.showMore}>
                    {this.state.expanded ? (
                            <span>Collapse List</span>
                        ) : (
                            <span>Show more</span>
                        )
                    }
                </button>
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