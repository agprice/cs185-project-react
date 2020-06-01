import React, { Component } from 'react'
import ModalMovie from "./ModalMovie"
import axios from 'axios';

export default class Movies extends Component {


    constructor() {
        super();
        this.state = {
            lists: {},
            movies: {}
        }
        this.deleteMovieHandler = this.deleteMovieHandler.bind(this);
        this.addMovie = (movie) => {
            var movieList = this.state.movies;
            movieList[movie.imdbID] = movie;
            this.setState({
                movies: movieList
            })
            console.log("movie state:", this.state.movies)
        }
        this.removeMovie = (movieID) => {
            var movieList = this.state.movies;
            delete movieList[movieID]
            this.setState({
                movies: movieList
            })
        }
        this.setLists = newLists => {
            this.setState({
                lists: newLists
            })
        }
    }

    componentDidMount() {
        // Grab a reference to movies, link updates to the updateMovieList function
        var movieRef = this.props.firebase.database().ref('movies/');
        movieRef.on('value', snapshot => {
            this.updateMovieListCallback(snapshot);
        });
        var listsRef = this.props.firebase.database().ref('lists/');
        listsRef.on('value', snapshot => {
            this.updateListsCallback(snapshot);
        });
    }

    // Handles callbacks when the movies database elements are updated
    updateMovieListCallback(snapshot) {
        snapshot.forEach((movieSnapshot) => {
            if (this.state.movies[movieSnapshot.key] == undefined) {
                console.log("Updating movie list with movie:", movieSnapshot.key);
                this.addMovie(movieSnapshot.child('meta').val());
            }
        })
    }

    // Set the list of lists when the firebase callback happens
    updateListsCallback(snapshot) {
        this.setLists(snapshot.val());
    }

    // Handles adding new movies on form submission
    addMovieFormHandler(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        var movieID = data.get('movieID');
        // Only add the movie if it doesn't already exist
        if (this.state.movies[movieID] == undefined) {
            console.log("Querying OMDb for title:", movieID)
            // Grab movie metadata from OMDb
            axios.get('https://www.omdbapi.com/?apikey=fe15e914&i=' + movieID).then(response => {
                // Thin the data for website database. This makes the database lighter.
                var relevantMeta = {
                    Title: response.data.Title,
                    Ratings: response.data.Ratings,
                    Director: response.data.Director,
                    Plot: response.data.Plot,
                    Poster: response.data.Poster,
                    Language: response.data.Language,
                    Released: response.data.Released,
                    Rated: response.data.Rated,
                    Type: response.data.Type,
                    imdbID: response.data.imdbID
                }
                // Push new movie into the database
                this.props.firebase.database().ref('movies/' + data.get('movieID')).set({
                    meta: relevantMeta,
                    lists: {
                        WannaWatch: true
                    }
                })

            })
        }
        event.target.reset();
    }

    deleteMovieHandler(movieID) {
        console.log("Deleting movie:", movieID);
        this.props.firebase.database().ref('movies/' + movieID).remove();
        this.removeMovie(movieID);
    }

    addListHandler(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        this.props.firebase.database().ref('lists/' + data.get('listName')).update({
            active: false
        })
        event.target.reset();
    }

    listSelectHandler(movieID, list) {
        console.log("List Selected:", movieID, list);
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
                <form className='w3-container w3-padding w3-dark-gray w3-round-large' onSubmit={this.addListHandler.bind(this)}>
                    <input placeholder="Add new Movie List, letter and numbers only" pattern="[A-Za-z0-9 ]{1,50}" className="w3-input" type="text" name="listName" required />
                    <input type="submit" value="Post Message" />
                </form>
                <div className='w3-margin movie_grid'>
                    {Object.keys(this.state.movies).map((movieID, index) => (
                        <ModalMovie handleListSelect={this.listSelectHandler} lists={this.state.lists} deleteHandler={this.deleteMovieHandler} key={index} movieJSON={this.state.movies[movieID]} src={this.state.movies[movieID].Poster} />
                    ))}
                </div>
            </div>
        )
    }
}
