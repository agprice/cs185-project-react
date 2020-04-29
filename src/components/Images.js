import React, { Component } from 'react'
import ModalImage from "../containers/ModalImage"

export default class Images extends Component {
    render() {
        return (
            <div className='w3-center w3-padding-large w3-container' id='main'>
                <header class='w3-container w3-padding-32 w3-center w3-black' id='home'>
                    <h1 class='w3-jumbo'>Images</h1>
                    <p>Some Images collected from across the years</p>
                </header>

                <div className='w3-row-padding'>
                    <ModalImage alt='House in a Prairie' src={require('../images/lonely-house.jpg')} />
                    <ModalImage alt='A Tack on Titan' src={require('../images/a_tac_on_titan.png')} />
                    <ModalImage alt='Scenic Valley' src={require('../images/pleasant_valley.jpg')} />
                    <ModalImage alt='Boat by Odaiba' src={require('../images/IMG_3234.JPG')} />
                    <ModalImage alt='Stone Wall' src={require('../images/P1090090.JPG')} />
                    <ModalImage alt="Don't Smoke" src={require('../images/IMG_3263.JPG')} />
                    <ModalImage alt="Don't Pasture that Dog" src={require('../images/IMG_3264.JPG')} />
                    <ModalImage alt='Large Spider, in the Park' src={require('../images/P1080899.JPG')} />
                    <ModalImage alt='Background from UCSB Rooms' src={require('../images/background.png')} />
                </div>
            </div>
        )
    }
}
