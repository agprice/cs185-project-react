import React, { Component } from 'react';
import SOSAtlas from './SOSAtlas';
import PortfolioPiece from './PortfolioPiece'

export default class Portfolio extends Component {
    render() {
        var SOS = SOSAtlas;
        return (
            <div className="w3-padding-large w3-center" id="main">
                <header className="w3-container w3-padding-32 w3-center w3-black">
                    <h1 className="w3-jumbo">Portfolio</h1>
                    <p>Previous Pieces and Projects</p>
                </header>
                <div className="w3-row-padding w3-content w3-center">
                    <PortfolioPiece
                        changeTab={this.props.changeTab}
                        src={require("../images/SOS-Atlas.png")}
                        alt="SOS-Atlas"
                        title="SOS-Atlas"
                        description="A small procedurally generated shooter. In this local co-op adventure, play with friends to battle for objectives in procedurally generated worlds!"
                        comp={SOS}
                    />
                    <PortfolioPiece
                        href="https://ucsb-rooms.herokuapp.com/"
                        src={require("../images/ucsb-rooms-small.png")}
                        alt="UCSB-Rooms"
                        title="UCSB-Rooms"
                        description="This small app allows users to search classroom schedules at UCSB. Knowing a room's schedule allows you to know if it's available. Written in Python Flask."
                        comp={SOS}
                    />
                </div>
            </div>
        )
    }
}
