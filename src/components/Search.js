import React, {PureComponent} from "react"

export default class Search extends PureComponent {

    constructor(props){
        super(props);
    }

    render() {

        const {handleSearchInput} = this.props;

        return (
            <div className="search-row">
                <h3>Find your store</h3>
                <input type="text" onChange={handleSearchInput} placeholder="Search"/>
            </div>
        );
    }
}