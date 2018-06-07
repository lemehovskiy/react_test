import React, {PureComponent} from "react"

export default class Search extends PureComponent {

    constructor(props){
        super(props);
    }

    render() {

        const {handleSearchInput} = this.props;

        return (
            <input type="text" onChange={handleSearchInput}/>
        );
    }
}