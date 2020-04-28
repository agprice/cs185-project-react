import React, { Component } from 'react'

export default class SmallTab extends Component {
    selectTabIfActive = () => {
        var baseClass = 'w3-bar-item w3-button tabBtn ';
        if (this.props.tab.component === this.props.activeTab) {
            return baseClass + ' w3-gray';
        }
        else {
            return baseClass;
        }
    }
    render() {
        return (
            <div className={this.selectTabIfActive()} onClick={this.props.changeTab.bind(this, this.props.tab.component)}><b>{this.props.tab.title}</b></div>
        )
    }
}
