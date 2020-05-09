import React, { Component } from 'react'
import LogForm from './LogForm'
import config from '../config.js'

const firebase = require('firebase')

export default class GuestLog extends Component {
    /**
     * This constructor sets up the state which contains the firebase JSON data
     */
    constructor() {
        super();
        this.state = {
            data: ['hi', 'there', 'buddy'],
        }
        this.setData = (snapshot) => {
            var postArray = [];
            snapshot.forEach((childSnapshot) => {
                postArray.push(childSnapshot.val());
            })
            console.log(postArray);
            this.setState({
                data: postArray
            })
        }
    }
    /**
     * Setup the firebase database when the component is initialized
     */
    componentDidMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }

        let ref = firebase.database().ref('data');

        //retrieve its data
        ref.orderByChild("public").equalTo("true").on('value', snapshot => {
            //this is your call back function
            //state will be a JSON object after this
            //set your apps state to contain this data however you like
            // const state = snapshot.val()
            //since i use react 16, i set my state like this
            //i have previously declared a state variable like this: const [data, setData] = useState([]) so that I can make the below call
            this.setData(snapshot);
        });
    }

    /**
     * Pushes data to the database. This can be called on form submission.
     */
    handleFormSubmit(event) {
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        const data = new FormData(event.target);
        var newPost = {};
        data.forEach((value, key) => { newPost[key] = value });
        newPost['date'] = firebase.database.ServerValue.TIMESTAMP
        firebase.database().ref('data').push().set(newPost);
    }

    render() {
        return (
            <div className='w3-padding-large' id='main'>
                <header className='w3-container w3-padding-32 w3-center w3-black' id='home'>
                    <h1 className='w3-jumbo'>Guest Log</h1>
                </header>
                <div className="w3-row-padding">
                    <div className='w3-half  w3-container w3-margin-bottom'>
                        <LogForm submitHandler={this.handleFormSubmit} />
                    </div>
                    <div className='w3-half scrollBox'>
                        {
                            this.state.data.map((postJSON, index) => (
                                <div className="guest-post w3-dark-gray">
                                    <div className="post-info">
                                        {postJSON.name + " "}
                                        {Intl.DateTimeFormat("en-GB", {
                                            year: "numeric",
                                            month: "numeric",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: false
                                        }).format(postJSON.date)}
                                    </div>
                                    <div className="post-bio">
                                        <p>About me: {postJSON.about}</p>
                                    </div>
                                    <div className="post-message">
                                        <p>Message: {postJSON.message}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}
