import React, { Component } from 'react'

export default class LargeTab extends Component {
    selectTabIfActive = () => {
        var baseClass = 'w3-bar-item w3-button w3-padding-large w3-hover-dark-gray ';
        if (this.props.tab.component === this.props.activeTab) {
            return baseClass + ' w3-black';
        }
        else {
            return baseClass;
        }
    }
    setTabIcon = () => {
        var commonClasses = 'fa w3-xxlarge ';
        if (this.props.tab.title === 'Home') {
            return commonClasses + 'fa-home';
        }
        else if (this.props.tab.title === 'Portfolio') {
            return commonClasses + 'fa-folder-open'
        }
        else if (this.props.tab.title === 'Images') {
            return commonClasses + 'fa-file-image-o'
        }
        else if (this.props.tab.title === 'Videos') {
            return commonClasses + 'fa-video-camera'
        }
    }
    render() {
        return (
            <div className={this.selectTabIfActive()} onClick={this.props.changeTab.bind(this, this.props.tab.component)}>
                <i className={this.setTabIcon()} />
                <p>{this.props.tab.title}</p>
            </div>
        )
    }
}
