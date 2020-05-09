import React, { Component } from 'react'
import Select from 'react-select'
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
        const options = [
            { value: 'true', label: 'Public' },
            { value: 'false', label: 'Private' }
        ]
        return (
            <form className='w3-container w3-padding w3-dark-gray' onSubmit={this.props.submitHandler.bind(this)}>
                <div className="w3-panel">
                    <div className='w3-group w3-margin-bottom'>
                        <label className='w3-label'>Name</label>
                        <input pattern=".{6,19}" className="w3-input" type="text" name="name" required />
                    </div>
                    <div className='w3-group w3-margin-bottom'>
                        <label className='w3-label'>About Me</label>
                        <input pattern=".{0,99}" className="w3-input" type="text" name="about" />
                    </div>
                    <div className='w3-group w3-margin-bottom'>
                        <label className='w3-label'>Message</label>
                        <input pattern=".{16,499}" className="w3-input" type="text" style={{ height: '150px' }} name="message" required />
                    </div>
                    <Select className='w3-group w3-white w3-margin-bottom' name="public" defaultValue={options[0]} options={options} />

                    <div className='w3-group w3-margin-bottom'>
                        <label className='w3-label'>Email</label>
                        <input className="w3-input" type="text" name="email" />
                    </div>
                </div>
                <input type="submit" value="Submit" />
            </form >
        );
    }
}
