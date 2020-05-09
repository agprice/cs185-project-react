import React, { Component } from 'react'
import Select from 'react-select'
export default class LogForm extends Component {

    render() {
        const options = [
            { value: 'true', label: 'Public' },
            { value: 'false', label: 'Private' }
        ]
        return (
            <form className='w3-container w3-padding w3-dark-gray' onSubmit={this.props.submitHandler}>
                <div className="w3-panel">
                    <div className='w3-group w3-margin-bottom'>
                        <label className='w3-label'>Name</label>
                        <input  minLength="6" maxLength="19" className="w3-input" type="text" name="name" required />
                    </div>
                    <div className='w3-group w3-margin-bottom'>
                        <label className='w3-label'>About Me</label>
                        <input maxLength="99" className="w3-input" type="text" name="about" />
                    </div>
                    <div className='w3-group w3-margin-bottom'>
                        <label className='w3-label'>Message</label>
                        <textarea minLength="16" maxLength="499" className="w3-input" type="text" style={{ height: '150px' }} name="message" required />
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
