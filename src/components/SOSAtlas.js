import React, { Component } from 'react'

export default class SOSAtlas extends Component {
    render() {
        return (
            <div id="main">
                <video autoPlay muted loop id="background-video">
                    <source src={require("../videos/star_trails.mp4")} type="video/mp4" />
                </video>
                 <div className="background-overlay w3-padding-large">
                    <header className="w3-padding-32 w3-center">
                            <img alt='SOS-Atlas Logo' className="w3-padding" src={require("../images/SOS-Atlas-Large.png")} style={{width: '50%'}} /><br />
                        <a href="https://store.steampowered.com/app/781380/SOS_Atlas/" rel="noopener noreferrer" target="_blank" className="w3-large w3-button w3-black w3-round">View on Steam</a>
                    </header>

                    <div className="w3-center w3-padding-64">
                        <h2 className="w3-text-light-grey">About SOS-Atlas</h2>
                        <p>
                            SOS-Atlas is a fully dynamic procedurally generated first person shooter, created by Third Gate Studios.
                </p>
                        <hr className="separator" />
                        <h3>Gameplay Trailer</h3>
                        <div className="video-container">
                            <iframe title='SOS-Atlas Gameplay Trailer' src="https://www.youtube-nocookie.com/embed/iYiZVfaF2mg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
