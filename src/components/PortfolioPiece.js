import React, { Component } from 'react'

export default class PortfolioPiece extends Component {
    setPieceType = () => {
        console.log(this.props.href);
        if (!this.props.href && this.props.changeTab) {
            return (
                <div className="w3-half w3-container w3-hover-opacity w3-margin-bottom">
                    <div onClick={this.props.changeTab.bind(this, this.props.comp)} className="quiet-link">
                        <img src={this.props.src} alt={this.props.alt} className="portfolio-image" />
                        <div className="w3-container w3-dark-gray w3-round-xlarge w3-margin-bottom">
                            <h4><b>{this.props.title}</b></h4>
                            <p>{this.props.description}</p>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="w3-half w3-container w3-hover-opacity w3-margin-bottom">
                <a href={this.props.href} rel="noopener noreferrer" target="_blank" className="quiet-link">
                    <img src={this.props.src} alt={this.props.alt} className="portfolio-image" />
                    <div className="w3-container w3-dark-gray w3-round-xlarge w3-margin-bottom">
                        <h4><b>{this.props.title}</b></h4>
                        <p>{this.props.description}</p>
                    </div>
                </a>
            </div>
            );
        }
    }

    render() {
        return this.setPieceType();
    }
}
