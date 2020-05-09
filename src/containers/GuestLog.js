import React, { Component } from 'react'
import LogForm from '../components/LogForm'
import config from '../config.js'

const firebase = require('firebase')

export default class GuestLog extends Component {


    /**
     * This constructor sets up the state which contains the firebase JSON data
     */
    constructor() {
        super();
        this.postsEndRef = React.createRef()
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            data: ['hi', 'there', 'buddy'],
        }
        this.setData = (snapshot) => {
            var postArray = [];
            snapshot.forEach((childSnapshot) => {
                postArray.push(childSnapshot.val());
            })
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
        alert("Post Successful");
        this.postsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    render() {

        return (
            <div className='w3-padding-large guest-log' id='main'>
                <header className='w3-container w3-padding-32 w3-center' id='home'>
                    <h1 className='w3-jumbo'>Guest Log</h1>
                </header>
                <div className="w3-row-padding">
                    <div className='w3-half w3-animate-opacity w3-container w3-margin-bottom'>
                        <LogForm submitHandler={this.handleFormSubmit} />
                    </div>
                    <div className='w3-half w3-animate-opacity'>
                        <div className="scrollBox">
                            {
                                this.state.data.map((postJSON, index) => (
                                    <div key={index} className="guest-post w3-dark-gray w3-card w3-animate-opacity">
                                        <div className="post-info w3-margin-bottom">
                                            {postJSON.name + " "}
                                            {Intl.DateTimeFormat("en-GB", {
                                                year: "numeric",
                                                month: "numeric",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                second: "numeric",
                                                hour12: false
                                            }).format(postJSON.date)}
                                        </div>
                                        <div className="w3-group w3-margin-bottom post-bio">
                                            <label className="w3-label">About me:</label>
                                            <div className='w3-card w3-padding'>{postJSON.about}</div>
                                        </div>
                                        <div className="w3-group post-message">
                                            <label className="w3-label">Message:</label>
                                            <div className='w3-card w3-padding'>{postJSON.message}</div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div ref={this.postsEndRef} />
                        </div>
                        <button className="w3-margin-top w3-right-align w3-button w3-dark-gray" onClick={() => { this.postsEndRef.current.scrollIntoView({ behavior: 'smooth' }) }} >
                            go to latest
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
