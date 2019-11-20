import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';

class App extends React.PureComponent {

    constructor (props) {
        super(props)
        this.state = {
            value : ""
        }
    }

    componentDidMount () {
        this.timerID = setInterval (() => {
            fetch('/get')
                .then(res => res.json())
                .then(out_value => this.setState({value : out_value.data}))
                .catch(e => console.log(e))
        }, 500);
    }

    componentWillUnmount () {
        clearInterval(this.timerID);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        var body_obj = {
            '1' : this.refs.logon.value,
            '2' : this.refs.width.value,
            '3' : this.refs.select.value
        };
        this.refs.logon.value = "";
        this.refs.width.value = "";
        this.refs.select.value = "";
        fetch('/', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: JSON.stringify(body_obj)
        })
        .then(function(response) {
            return response.text().then(function(text) {
                return text ? JSON.parse("text") : {}
            })
        })
        .then(function(body) {
            console.log(body);
        });
    };

    render(){
        return (
            <>
                <header className="grid-item page_header">
                    Logon and Set Width command
                </header>

                <div className="grid-item output_div">
                    <pre>{ this.state.value }</pre>
                </div>
                <form onSubmit={this.handleSubmit} className="grid-item form_lable">
                    Logon: <br />
                    <input type="text" ref="logon" name="logon"
                     placeholder=".logon host:port/user,pass" required /> <br />
                    Set Width: <br />
                    <input type="text" ref="width" name="set-width"
                     placeholder=".set width 'number'" /> <br />
                    Select: <br />
                    <input type="text" ref="select" name="select"
                     placeholder="select..." /> <br />
                    <input type="submit" value="Submit" />
                </form>

                <footer className="grid-item page_footer">
                    BTEQ is optimized for learning, testing, and training.
                    Examples might be simplified to improve reading and basic
                    understanding. Tutorials, references, and examples are
                    constantly reviewed to avoid errors, but we cannot warrant
                    full correctness of all content. While using this site, you
                    agree to have read and accepted our terms of use, cookie and
                    privacy policy. Copyright 1999-2019 by Refsnes
                    Data. All Rights Reserved.
                </footer>

            </>
        )
    }
}




ReactDOM.render(<App />, document.getElementById('root'));


serviceWorker.unregister();
