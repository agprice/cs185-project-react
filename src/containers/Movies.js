import React, { Component } from 'react'
import ModalMovie from "./ModalMovie"
import axios from 'axios';
import Select from 'react-select'

export default class Movies extends Component {


    constructor() {
        super();
        this.state = {
            lists: {},
            movies: {},
            displayedMovies: {}
        }
        this.deleteMovieHandler = this.deleteMovieHandler.bind(this);
        this.listSelectHandler = this.addToListHandler.bind(this);
        this.setMovieListHandler = this.setMovieListHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        var selectedList;
        this.addMovie = (movie) => {
            var movieList = this.state.movies;
            movieList[movie.imdbID] = movie;
            this.setState({
                movies: movieList,
                displayedMovies: movieList
            })
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
        this.clearMovies = () => {
            this.setState({
                movies: {},
                displayedMovies: {}
            })
        }
        this.setDisplayedMovies = (movies) => {
            this.setState({
                displayedMovies: movies
            })
        }
    }

    componentDidMount() {
        // Grab a reference to movies, link updates to the updateMovieList function
        var movieRef = this.props.firebase.database().ref('lists/All/');
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
                if (response.data.Response === 'False') {
                    alert("Invalid IMDB ID")
                    return;
                }
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
                this.props.firebase.database().ref('lists/All/' + data.get('movieID')).set({
                    meta: relevantMeta
                })
            })
        }

        event.target.reset();
    }

    deleteMovieHandler(movieID) {
        console.log("Deleting movie:", movieID);
        // Set the list selection back to 'all'.
        this.selectedList = this.options[0];
        // Find all the lists this movie is on
        this.props.firebase.database().ref('lists/All/' + movieID + '/lists').once('value').then((snapshot) => {
            snapshot.forEach(movieSnapshot => {
                console.log("Snapshot delete val:", movieSnapshot.key);
                // Delete the movie from all the lists
                this.props.firebase.database().ref('lists/' + movieSnapshot.key + '/' + movieID).remove();
            });
            // Delete the movie from the All list
            this.props.firebase.database().ref('lists/All/' + movieID).remove();
        });
        // Remove movie from the GUI
        this.removeMovie(movieID);
    }

    addListHandler(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        this.props.firebase.database().ref('lists/' + data.get('listName')).set({
            active: true
        })
        event.target.reset();
    }

    addToListHandler(movieID, list) {
        console.log("List Selected:", movieID, list);
        // Add this movie to the list
        this.props.firebase.database().ref('lists/' + list.value + '/' + movieID).set({ meta: this.state.movies[movieID] });
        // Update the lists that this movie is a part of
        this.props.firebase.database().ref('lists/All/' + movieID + '/lists/' + list.value).set(true);
    }

    getOptions() {
        const opts = [];
        if (this.state.lists != null) {
            Object.keys(this.state.lists).forEach((key) => {
                opts.push({ value: key, label: key });
            })
        }
        return opts;
    }

    // Select a movie list to display
    setMovieListHandler(movieList) {
        console.log("Setting active list to:", movieList.value);
        // Clear out the list of movies to populate it with a new list
        this.clearMovies();
        this.props.firebase.database().ref('lists/' + movieList.value).once('value').then((snapshot) => {
            snapshot.forEach((movieSnapshot) => {
                if (this.state.movies[movieSnapshot.key] == undefined && movieSnapshot.key != 'active') {
                    console.log("Updating movie list with movie:", movieSnapshot.key);
                    this.addMovie(movieSnapshot.child('meta').val());
                }
            })
        });
    }

    filterQuery(obj, predicate) {
        return Object.fromEntries(Object.entries(obj).filter(predicate));
    }

    searchHandler(event) {
        if (event.target.value !== "") {

            var filtered = "hi";
            filtered = this.filterQuery(this.state.movies, ([movieID, Meta]) => {
                const filter = event.target.value.toLowerCase();
                let result = Meta.Title.toLowerCase().includes(filter)
                return result;
            })
            this.setDisplayedMovies(filtered);
        }
        else {
            this.setDisplayedMovies(this.state.movies);
        }
    }

    render() {
        this.options = this.getOptions();
        return (
            <div className='w3-center w3-padding-large w3-container' id='main'>
                <header className='w3-container w3-padding-32 w3-center w3-black' id='home'>
                    <h1 className='w3-jumbo'>Movies</h1>
                    <p>Legendary Movies of Great Quality</p>
                </header>
                <form className='w3-container w3-padding w3-dark-gray w3-round-large' onSubmit={this.addMovieFormHandler.bind(this)}>
                    <input placeholder="Add Movie with IMDB ID" minLength="9" maxLength="9" className="w3-input" type="text" name="movieID" required />
                    <input type="submit" value="Add Movie" />
                </form>
                <form className='w3-container w3-padding w3-dark-gray w3-round-large' onSubmit={this.addListHandler.bind(this)}>
                    <input placeholder="Add new Movie List, letter and numbers only" pattern="[A-Za-z0-9 ]{1,50}" className="w3-input" type="text" name="listName" required />
                    <input type="submit" value="Add List" />
                </form>
                <input onChange={this.searchHandler} className='w3-group w3-white w3-input' type="text" placeholder="Search..." />
                <Select value={this.selectedList} isSearchable={true} className='w3-group w3-white' name="MovieList" onChange={this.setMovieListHandler} options={this.options} />
                <div className='w3-margin movie_grid'>
                    {Object.keys(this.state.displayedMovies).map((movieID, index) => (
                        <ModalMovie handleListSelect={this.addToListHandler} lists={this.state.lists} deleteHandler={this.deleteMovieHandler} key={index} movieJSON={this.state.displayedMovies[movieID]} src={this.state.displayedMovies[movieID].Poster} />
                    ))}
                </div>
            </div>
        )
    }
}
