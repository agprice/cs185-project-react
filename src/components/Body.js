import React, { Component } from 'react';

export default class Body extends Component {

    render() {
        var currentBody = <this.props.activeTab changeTab={this.props.changeTab}/>
        return (
            <div className="w3-black">
                {currentBody}
            </div>
        );
    }
}