import React, { Component } from 'react'
import Select from 'react-select'

export default class ModalMovie extends Component {
    state = { isOpen: false };
    constructor() {
        super()
        this.getOptions = this.getOptions.bind(this);
    }

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

    getOptions() {
        console.log("Getting list options for movie modal", this.props.movieJSON)
        const opts = [];
        if (this.props.lists != null) {
            let filtered = Object.keys(this.props.lists);
            if (this.props.movieJSON.lists !== undefined) {
                console.log("This object", this.props.movieJSON.meta.imdbID, "has membership in lists", this.props.movieJSON.lists)
                filtered = Object.keys(this.props.lists).filter(x => !Object.keys(this.props.movieJSON.lists).includes(x))
            }
            filtered.forEach((key) => {
                // Don't allow the user to add to the 'all' list
                if (key !== 'All')
                    opts.push({ value: key, label: key });
            })
        }
        return opts;
    }

    render() {
        return (
            <div>
                <img
                    className="w3-hover-opacity"
                    src={this.props.src}
                    onClick={this.handleShowDialog}
                    alt={this.props.movieJSON.meta.title}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
                {this.state.isOpen && (
                    <div onClick={this.handleShowDialog} id='mediaModal' className='modal w3-center'>
                        <div className='modal-content w3-container w3-padding w3-round-large w3-row-padding'>
                            <img onClick={this.stopPropogation} alt={this.props.movieJSON.meta.title} src={this.props.src} className='w3-half' id='modalImage'></img>
                            <div className='w3-centered w3-half'>
                                <div>
                                    <h2 className="w3-left-align"><b>{this.props.movieJSON.meta.Title}</b></h2>
                                </div>
                                <div className="w3-row-padding">
                                    <div className="w3-yellow w3-tag w3-padding w3-half w3-round-large">
                                        IMDB Score: {this.props.movieJSON.meta.Ratings[0].Value}
                                    </div>
                                    <div className="w3-blue w3-tag w3-padding w3-half w3-round-large">
                                        Metacritic: {this.props.movieJSON.meta.Ratings[2].Value}
                                    </div>
                                </div>
                                <div className='w3-margin'>
                                    <button onClick={this.props.deleteHandler.bind(this, this.props.movieJSON.meta.imdbID)} className="w3-red w3-tag w3-button w3-round-large">
                                        Delete Movie
                                    </button>
                                </div>
                                <div className="w3-margin w3-left-align">
                                    Directed by <b>{this.props.movieJSON.meta.Director}</b>
                                </div>
                                <div onClick={this.stopPropogation} className="w3-margin w3-left-align">
                                    Add to List:
                                    <Select className='w3-group w3-white' name="public" onChange={this.props.handleListSelect.bind(this, this.props.movieJSON.meta.imdbID)} options={this.getOptions()} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
