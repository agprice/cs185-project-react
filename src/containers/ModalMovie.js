import React, { Component } from 'react'

export default class ModalMovie extends Component {
    state = { isOpen: false };

    handleShowDialog = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };
    stopPropogation = (event) => {
        if (!event) {
            event = window.event;
        }
        event.stopPropagation();
    };
    chooseModalClass = () => {
        if (this.props.content === 'video') {
            return (
                <div className='w3-third'>
                    <video onClick={this.handleShowDialog} src={this.props.src} className="w3-hover-opacity" style={{ width: '100%', cursor: 'pointer' }}/>
                    {this.state.isOpen && (
                        <div onClick={this.handleShowDialog} id='mediaModal' className='modal w3-center'>
                            <div className='modal-content'>
                                <video onClick={this.stopPropogation} src={this.props.src} loop controls autoPlay style={{width: '100%', height: '100%'}} class="w3-center"  id="modalImage" />
                                <div id='caption'>{this.props.alt}</div>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
        else {
            return (
                <div className='w3-quarter'>
                    <img
                        className="w3-hover-opacity w3-quarter"
                        src={this.props.src}
                        onClick={this.handleShowDialog}
                        alt={this.props.alt}
                        style={{ width: '100%', cursor: 'pointer' }}
                    />
                    {this.state.isOpen && (
                        <div onClick={this.handleShowDialog} id='mediaModal' className='modal w3-center'>
                            <div className='modal-content'>
                                <img onClick={this.stopPropogation} alt={this.props.alt} src={this.props.src} className='w3-center' id='modalImage'></img>
                                <div id='caption'>{this.props.alt}</div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    }
    render() {
        return this.chooseModalClass();
    }
}
