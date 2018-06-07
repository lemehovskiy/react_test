import React, {PureComponent} from "react"

export default class MyStore extends PureComponent {

    render() {

        return (
            <div>
                {this.props.store.title}
            </div>
        );
    }
}