import React, { Component } from 'react'
import LargeTab from './LargeTab'
import SmallTab from './SmallTab'

export default class TabList extends Component {
    render() {
        return (
            <div>
                {/* Large screen LHS Menu */}
                <nav className="w3-sidebar w3-bar-block w3-small w3-hide-small w3-center">
                    <img alt="Nav-Bar-header" src={require('../images/home-icon.png')} style={{ width: '100%' }}></img>
                    {
                        this.props.tabs.map((tab, index) => (
                            <LargeTab key={index} tab={tab} changeTab={this.props.changeTab} activeTab={this.props.activeTab} />
                        ))
                    }
                </nav>
                {/* Small screen top Menu */}
                <div className='w3-top w3-hide-large w3-hide-medium' id='smallNavbar'>
                    <div className='w3-bar w3-black w3-hover-opacity-off w3-center w3-small'>
                        {
                            this.props.tabs.map((tab, index) => (
                                <SmallTab key={index} tab={tab} changeTab={this.props.changeTab} activeTab={this.props.activeTab} />
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}