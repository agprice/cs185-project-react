import React, { Component } from 'react'
import ModalMovie from "./ModalMovie"
import axios from 'axios';

export default class Movies extends Component {


    constructor() {
        super();
        this.state = {
            movies: {}
        }
        this.deleteMovieHandler = this.deleteMovieHandler.bind(this);
        this.addMovie = (movie) => {
            var movieList = this.state.movies;
            console.log(movie);
            movieList[movie.imdbID] = movie;
            console.log(Object.keys(movieList));
            this.setState({
                movies: movieList
            })
        }
        this.removeMovie = (movieID) => {
            var movieList = this.state.movies;
            delete movieList[movieID]
            this.setState({
                movies: movieList
            })
        }
    }

    componentDidMount() {
        // Grab a reference to movies, link updates to the updateMovieList function
        this.movieRef = this.props.firebase.database().ref('movies/');
        this.movieRef.on('value', snapshot => {
            this.updateMovieList(snapshot);
        });
    }

    updateMovieList(snapshot) {
        console.log(this.state.movies);
        snapshot.forEach((movieSnapshot) => {
            console.log("Updating movie list", movieSnapshot.key);
            this.grabMetaAndAddByID(movieSnapshot.key);
        })
    }

    grabMetaAndAddByID(movieID) {
        if (this.state.movies[movieID] == undefined) {
            console.log("Adding movie:", movieID);
            axios.get('https://www.omdbapi.com/?apikey=fe15e914&i=' + movieID).then(response => {
                this.addMovie(response.data);
            })
        }
    }

    addMovieFormHandler(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        this.props.firebase.database().ref('movies/' + data.get('movieID')).set({
            lists: {
                WannaWatch: true
            }
        })
        event.target.reset();
    }

    deleteMovieHandler(movieID) {
        console.log("Deleteing movie: ", movieID);
        this.props.firebase.database().ref('movies/' + movieID).remove();
        this.removeMovie(movieID);
    }

    render() {
        return (
            <div className='w3-center w3-padding-large w3-container' id='main'>
                <header className='w3-container w3-padding-32 w3-center w3-black' id='home'>
                    <h1 className='w3-jumbo'>Movies</h1>
                    <p>Legendary Movies of Great Quality</p>
                </header>
                <form className='w3-container w3-padding w3-dark-gray w3-round-large' onSubmit={this.addMovieFormHandler.bind(this)}>
                    <input placeholder="Add Movie with IMDB ID" minLength="9" maxLength="9" className="w3-input" type="text" name="movieID" required />
                    <input type="submit" value="Post Message" />
                </form>
                <div className='w3-margin movie_grid'>
                    {Object.keys(this.state.movies).map((movieID, index) => (
                        <ModalMovie deleteHandler={this.deleteMovieHandler} key={index} movieJSON={this.state.movies[movieID]} src={this.state.movies[movieID].Poster} />
                    ))}
                </div>
            </div>
        )
    }
}
