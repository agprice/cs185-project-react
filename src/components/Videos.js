import React, { Component } from 'react'
import ModalImage from "../containers/ModalImage"

export default class Videos extends Component {
    // componentDidMount() {
    //     const script = document.createElement("script");
    //     script.async = true;
    //     script.src = "../media-modal.js";
    //     document.head.appendChild(script);
    // }

    render() {
        return (
            <div className='w3-center w3-padding-large w3-container' id='main'>

                <header className="w3-container w3-padding-32 w3-center w3-black" id="home">
                    <h1 className="w3-jumbo">Videos</h1>
                    <p>Gems from Across the Ages</p>
                </header>

                <div className="w3-row-padding">
                    <ModalImage alt='SOS-Atlas Loading Screen' content='video' src={require('../videos/star_trails.mp4')}/>
                    <ModalImage alt='Testing at Trinity' content='video' src={require('../videos/Trinity and Beyond - 1995.webm')}/>
                    <ModalImage alt='Space Shuttle Liftoff' content='video' src={require('../videos/Space Shuttle Enterprise.webm')}/>
                    <ModalImage alt='Portals' content='video' src={require('../videos/Checkout Portals.webm')}/>
                </div>
            </div>
        )
    }
}
