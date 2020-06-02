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
            displayedMovies: {},
            movieCount: 0,
            databaseLimit: 8,
            search: ""
        }
        this.deleteMovieHandler = this.deleteMovieHandler.bind(this);
        this.addToListHandler = this.addToListHandler.bind(this);
        this.setMovieListHandler = this.setMovieListHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.incrementVisibleMovies = this.incrementVisibleMovies.bind(this);

        this.loadMoreAmount = 8;

        this.addMovie = (movie) => {
            var movieList = this.state.movies;
            movieList[movie.meta.imdbID] = movie;
            this.setState({
                movies: movieList,
            })
        }
        this.removeMovie = (movieID) => {
            var movieList = this.state.movies;
            var displayedMovies = this.state.displayedMovies;
            delete movieList[movieID]
            delete displayedMovies[movieID]
            this.setState({
                movies: movieList,
                displayedMovies: displayedMovies
            })
        }
        this.setLists = newLists => {
            this.setState({
                lists: newLists
            })
        }
        this.clearMovies = (callback) => {
            this.setState({
                movies: {},
                displayedMovies: {}
            }, callback)
        }
        this.setDisplayedMovies = (movies) => {
            this.setState({
                displayedMovies: movies
            })
        }
        this.setMovieCount = (count) => {
            this.setState({
                movieCount: count
            })
        }
        this.setDatabaseLimit = (count) => {
            this.setState({
                databaseLimit: count
            })
        }
        this.setSearch = (search) => {
            this.setState({
                search: search
            })
        }
    }

    componentDidMount() {
        // Grab a reference to movies, link updates to the updateMovieList function
        var movieRef = this.props.firebase.database().ref('lists/All/');
        movieRef.on('value', snapshot => {
            this.updateMovieListCallback(snapshot);
            console.log("Current state", this.state.movies)
            this.limitAndSetDisplayedMovies();
        });
        var listsRef = this.props.firebase.database().ref('lists/');
        listsRef.on('value', snapshot => {
            this.updateListsCallback(snapshot);
        });
        this.props.firebase.database().ref('lists/All/count').once('value').then(snapshot => {
            this.setMovieCount(snapshot.val())
            console.log("There are", this.state.movieCount, "movies in the database.")
        });
    }

    limitAndSetDisplayedMovies() {
        this.setDisplayedMovies(Object.fromEntries(Object.entries(this.state.movies).slice(0, this.state.databaseLimit)))
        this.searchFilter(this.state.search);
    }

    // Handles callbacks when the movies database elements are updated
    updateMovieListCallback(snapshot) {
        snapshot.forEach((movieSnapshot) => {
            if (this.state.movies[movieSnapshot.key] === undefined && movieSnapshot.key !== 'count') {
                this.setSearch("")
                console.log("First Time, Updating movie list with movie:", movieSnapshot.key);
                this.addMovie(movieSnapshot.val());
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
        if (this.state.movies[movieID] === undefined) {
            this.props.firebase.database().ref("lists/All/" + movieID).once('value', (snapshot) => {
                if (snapshot.val() === null) {
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
                        let newMovie = {
                            meta: relevantMeta
                        };
                        this.props.firebase.database().ref('lists/All/' + data.get('movieID')).set(newMovie);
                        this.updateMovieCount(1, 'All');
                        this.setMovieListHandler({ value: "All" });
                        this.selectedList = this.options[0];
                        this.addMovie(newMovie);
                    });
                }
            })
        }
        event.target.reset();
    }

    // This function keeps track of the number of movies in the database
    updateMovieCount(amount, list) {
        this.props.firebase.database().ref('lists/' + list + '/count').once('value', (snapshot) => {
            console.log("Grabbed value,", snapshot.key);
            let newCount = snapshot.val() + amount;
            this.setMovieCount(newCount);
            this.props.firebase.database().ref('lists/' + list + '/count').set(newCount);

        })
    }

    deleteMovieHandler(movieID) {
        console.log("Deleting movie:", movieID);
        // Find all the lists this movie is on
        this.props.firebase.database().ref('lists/All/' + movieID + '/lists').once('value').then((snapshot) => {
            snapshot.forEach(movieSnapshot => {
                console.log("Snapshot delete val:", movieSnapshot.key);
                // Decrement the list value
                this.updateMovieCount(-1, movieSnapshot.key)
                // Delete the movie from all the lists
                this.props.firebase.database().ref('lists/' + movieSnapshot.key + '/' + movieID).remove();
            });
            // Delete the movie from the All list
            this.props.firebase.database().ref('lists/All/' + movieID).remove();
            // Remove movie from the GUI
            this.removeMovie(movieID);
            this.updateMovieCount(-1, 'All');
        });
    }

    addListHandler(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        this.props.firebase.database().ref('lists/' + data.get('listName')).set({
            count: 0
        })
        event.target.reset();
    }

    // Adds a movie to a list
    addToListHandler(movieID, list) {
        console.log("List Selected:", movieID, list);
        // Update the GUI object
        let newMovieState = this.state.movies[movieID];
        if (newMovieState.lists === undefined) {
            newMovieState.lists = {}
        }
        newMovieState.lists[list.value] = true;
        this.addMovie(newMovieState);
        // Add this movie to the list
        this.props.firebase.database().ref('lists/' + list.value + '/' + movieID).set(this.state.movies[movieID]);
        let countRef = this.props.firebase.database().ref('lists/' + list.value + '/count')
        countRef.once('value', (snapshot) => {
            countRef.set(snapshot.val() + 1);
        });
        // Update the lists that this movie is a part of
        this.props.firebase.database().ref('lists/All/' + movieID + '/lists/' + list.value).set(true);
        // Update every list, oof probably could have made the database better...
        this.props.firebase.database().ref('lists/All/' + movieID + '/lists').once('value').then((snapshot) => {
            snapshot.forEach(movieSnapshot => {
                console.log("Adding to list at:", movieSnapshot.key);
                // Delete the movie from all the lists
                this.props.firebase.database().ref('lists/' + movieSnapshot.key + '/' + movieID + '/lists/' + list.value).set(true);
            });
        });

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
        // Only change the list if we're not already on that list
        if (this.selectedList.value !== movieList.value) {
            // Turn off live time updating associated with the previous list
            console.log("Stopping listening to list", this.selectedList.value);
            this.props.firebase.database().ref('lists/' + this.selectedList.value).off();

            console.log("Setting active list to:", movieList.value);
            // Clear the search
            this.setSearch("")
            // Ensure the dropdown menu tracks the selected entry
            this.selectedList = movieList;
            // Get the number of movies in this list
            this.props.firebase.database().ref('lists/' + movieList.value + '/count').once('value', (snapshot) => {
                let newMovieCount = snapshot.val();
                this.setMovieCount(newMovieCount);
            });
            // Clear out the list of movies to populate it with a new list
            this.clearMovies(() => {
                console.log("this should be clear:", this.state.movies);
                // turn on live time updating with new list
                this.props.firebase.database().ref('lists/' + movieList.value).on('value', snapshot => {
                    console.log("Callback when switching lists with", snapshot.val())
                    this.updateMovieListCallback(snapshot);
                    this.limitAndSetDisplayedMovies()
                });
            });
        }
    }

    // helper for search
    filterQuery(obj, predicate) {
        return Object.fromEntries(Object.entries(obj).filter(predicate));
    }

    // Filter based on the given string
    searchFilter(filterString) {
        if (filterString !== "") {

            var filtered = this.filterQuery(this.state.movies, ([movieID, Meta]) => {
                const filter = filterString.toLowerCase();
                let result = Meta.meta.Title.toLowerCase().includes(filter)
                return result;
            })
            this.setDisplayedMovies(filtered);
        }
        else {
            this.setDisplayedMovies(Object.fromEntries(Object.entries(this.state.movies).slice(0, this.state.databaseLimit)))
        }
    }

    // When typing in the search
    searchHandler(event) {
        this.setSearch(event.target.value);
        this.searchFilter(event.target.value);
    }

    // Load more button
    incrementVisibleMovies() {
        let newDataBaseLimit = this.state.databaseLimit + this.loadMoreAmount;
        this.setDatabaseLimit(newDataBaseLimit);
        if (this.selectedList.value !== undefined) {
            console.log("Incrementing videos, new amount is:", this.state.databaseLimit);
            this.limitAndSetDisplayedMovies();
        }
    }

    render() {
        this.options = this.getOptions();
        if (this.selectedList === undefined) {
            this.selectedList = this.options[0];
        }
        return (
            <div className='w3-center w3-padding-large' id='main'>
                <header className='w3-container w3-padding-32 w3-center w3-black' id='home'>
                    <h1 className='w3-jumbo'>Movies</h1>
                    <p>Legendary Movies of Great Quality</p>
                </header>
                <div className='w3-padding-large deep_gray w3-round-large'>
                    <div className='w3-dark-gray w3-round-large w3-padding w3-margin'>
                        <input value={this.state.search} onChange={this.searchHandler} className='w3-group w3-white w3-input' type="text" placeholder="Search..." />
                    </div>
                    <form className='w3-dark-gray w3-round-large w3-padding w3-margin' onSubmit={this.addMovieFormHandler.bind(this)}>
                        <input className='w3-half w3-margin-right' placeholder="Add Movie with IMDB ID" minLength="9" maxLength="9" type="text" name="movieID" required />
                        <input type="submit" value="Add Movie" />
                    </form>
                    <form className='w3-dark-gray w3-round-large w3-padding w3-margin' onSubmit={this.addListHandler.bind(this)}>
                        <input className='w3-half w3-margin-right' placeholder="Add new Movie List" pattern="[A-Za-z0-9 ]{1,50}" type="text" name="listName" required />
                        <input type="submit" value="Add List" />
                    </form>
                    <div className='w3-margin'>
                        <label>Select List</label>
                        <Select value={this.selectedList} isSearchable={true} className='w3-group w3-white' name="MovieList" onChange={this.setMovieListHandler} options={this.options} />
                    </div>
                </div>
                <div className='w3-margin movie_grid'>
                    {Object.keys(this.state.displayedMovies).map((movieID, index) => (
                        <ModalMovie handleListSelect={this.addToListHandler} lists={this.state.lists} deleteHandler={this.deleteMovieHandler} key={index} movieJSON={this.state.displayedMovies[movieID]} src={this.state.displayedMovies[movieID].meta.Poster} />
                    ))}
                </div>
                {this.state.movieCount > this.state.databaseLimit ?
                    (<button onClick={this.incrementVisibleMovies} className="w3-dark-gray w3-padding w3-button w3-round-large w3-center">
                        load more
                    </button>)
                    : null
                }
            </div>
        )
    }
}
