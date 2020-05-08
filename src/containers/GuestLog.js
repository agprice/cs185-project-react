import React, { Component } from 'react'
import LogForm from './LogForm'
import config from '../config.js'

const firebase = require('firebase')

export default class GuestLog extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            shouldRender: false
        }
        this.setData = (array) => {
            this.setState({
                data: array
            })
        }
        this.setShouldRender = (render) => {
            this.setState({
                shouldRender: render
            })
        }
    }

    componentDidMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp(config)
        }

        let ref = firebase.database().ref('data')

        //retrieve its data
        ref.on('value', snapshot => {
            //this is your call back function
            //state will be a JSON object after this
            //set your apps state to contain this data however you like
            const state = snapshot.val()
            //since i use react 16, i set my state like this
            //i have previously declared a state variable like this: const [data, setData] = useState([]) so that I can make the below call
            this.setData(state)
        })
    }

    render() {
        return (
            <div className='w3-padding-large' id='main'>

                <LogForm/>
                {this.state.data}
            </div>
        )
    }
}
