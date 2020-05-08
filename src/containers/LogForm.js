import React, { Component } from 'react'

export default class LogForm extends Component {
    constructor(props) {
        super(props);
        // this.state = { value: '' };

        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    // handleChange(event) {
    //     this.setState({ value: event.target.value });
    // }

    render() {
        return (
            <form onSubmit={this.props.submitHandler.bind(this)}>
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
                <label>
                    About Me:
                    <input type="text" name='about' />
                </label>
                <label>
                    Message:
                    <input type="text" name='message' />
                </label>
                <label>
                    Public:
                    <input type="text" name='public' />
                </label>
                <label>
                    Email:
                    <input type="text" name='email' />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
