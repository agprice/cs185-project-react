import React, { Component } from 'react'
import ModalMovie from "./ModalMovie"
import axios from 'axios';

export default class Movies extends Component {


    constructor() {
        super();
        this.state = {
            movies: []
        }
        this.addMovie = (movie) => {
            var movieList = this.state.movies.concat(movie);
            this.setState({
                movies: movieList
            })
        }
    }

    componentDidMount() {
        var data = require('../json/movies.json');
        data.movies.map((movieID, index) => (
            axios.get('https://www.omdbapi.com/?apikey=fe15e914&i=' + movieID)
                .then(response => {
                    this.addMovie(response.data);
                })
        ));
    }

    render() {
        return (
            <div className='w3-center w3-padding-large w3-container' id='main'>
                <header className='w3-container w3-padding-32 w3-center w3-black' id='home'>
                    <h1 className='w3-jumbo'>Movies</h1>
                    <p>Legendary Movies of Great Quality</p>
                </header>

                    <div className='w3-margin movie_grid'>
                        {this.state.movies.map((movieJSON, index) => (
                            <ModalMovie key={index} movieJSON={movieJSON} src={movieJSON.Poster} />
                        ))}
                    </div>
            </div>
        )
    }
}