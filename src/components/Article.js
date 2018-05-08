import React, {Component, PureComponent} from 'react'

class Article extends PureComponent {


    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentWillMount(){
        console.log('mount');
    }


    componentWillUpdate(){
        console.log('will_update')
    }

    render() {
        const {article, isOpen, onButtonClick} = this.props;

        const body = isOpen && <section>{article.text}</section>

        return (
            <div className="card">
                <div className="card-header">
                    <h2>
                        {article.title}
                        <button onClick={onButtonClick}>
                            {isOpen ? 'close' : 'open'}
                        </button>
                    </h2>
                </div>
                <div className="card-body">
                    {body}
                    <h3>creation date: {(new Date().toDateString())}</h3>
                </div>
            </div>
        )
    }

}


export default Article