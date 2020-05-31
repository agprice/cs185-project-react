import React, { Component } from 'react'

export default class ModalMovie extends Component {
    state = { isOpen: false };


    handleShowDialog = () => {
        this.setState({ isOpen: !this.state.isOpen });
        if (this.state.isOpen === false) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'auto';
        }
    };
    stopPropogation = (event) => {
        if (!event) {
            event = window.event;
        }
        event.stopPropagation();
    };

    render() {
        return (
            <div>
                <img
                    className="w3-hover-opacity"
                    src={this.props.src}
                    onClick={this.handleShowDialog}
                    alt={this.props.movieJSON.title}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
                {this.state.isOpen && (
                    <div onClick={this.handleShowDialog} id='mediaModal' className='modal w3-center'>
                        <div className='modal-content w3-container w3-padding w3-round-large w3-row-padding'>
                            <img onClick={this.stopPropogation} alt={this.props.movieJSON.title} src={this.props.src} className='w3-half' id='modalImage'></img>
                            <div className='w3-centered w3-half'>
                                <div>
                                    <h2 className="w3-left-align"><b>{this.props.movieJSON.Title}</b></h2>
                                </div>
                                <div>
                                    <div className="w3-yellow w3-padding w3-cell w3-round-large">
                                        IMDB Score: {this.props.movieJSON.Ratings[0].Value}
                                    </div>
                                    <div className="w3-blue w3-padding w3-cell w3-round-large">
                                        Metacritic: {this.props.movieJSON.Ratings[2].Value}
                                    </div>
                                </div>
                                <div className="w3-margin w3-left-align">
                                    Directed by <b>{this.props.movieJSON.Director}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}