import React, { Component } from 'react';
import SOSAtlas from './SOSAtlas';

export default class Portfolio extends Component {
    render() {
        var SOS = SOSAtlas;
        return (
            <div className="w3-padding-large w3-center" id="main">
                <header className="w3-container w3-padding-32 w3-center w3-black">
                    <h1 className="w3-jumbo">Portfolio</h1>
                    <p>Previous Pieces and Projects</p>
                </header>
                <div class="w3-row-padding w3-content w3-center">
                    <div className="w3-half w3-container w3-hover-opacity w3-margin-bottom">
                        <div onClick={this.props.changeTab.bind(this, SOS)} className="quiet-link">
                            <img src={require("../images/SOS-Atlas.png")} alt="SOS-Atlas" className="portfolio-image" />
                            <div className="w3-container w3-dark-gray w3-round-xlarge w3-margin-bottom">
                                <p><b>SOS-Atlas</b></p>
                                <p>A small procedurally generated shooter. In this local co-op adventure, play with friends to battle for objectives in procedurally generated worlds!</p>
                            </div>
                        </div>
                    </div>

                    <div className="w3-half w3-container w3-margin-bottom w3-hover-opacity">
                        <a href="https://ucsb-rooms.herokuapp.com/" rel="noopener noreferrer" target="_blank" className="quiet-link">
                            <img src={require("../images/ucsb-rooms-small.png")} alt="UCSB-Rooms" className="portfolio-image" />
                            <div className="w3-container w3-dark-gray w3-round-xlarge w3-margin-bottom">
                                <p><b>UCSB-Rooms</b></p>
                                <p>This small app allows users to search classroom schedules at UCSB. Knowing a room's schedule allows you to know if it's available to study in. Written in Python Flask.</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}
