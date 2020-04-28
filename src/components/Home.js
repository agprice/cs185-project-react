import React, { Component } from 'react'

export default class Home extends Component {
    render() {
        return (
            <div className='w3-padding-large' id='main'>
                <header className='w3-container w3-padding-32 w3-center w3-black' id='home'>
                    <h1 className='w3-jumbo'>Andrew Price</h1>
                    <p>Computer Science Professional</p>
                </header>
                <div className='w3-content w3-justify w3-text-grey w3-padding-64' id='about'>
                    <h2 className="w3-text-light-grey">About Me</h2>
                    <hr style={{ width: '300px' }} className="separator w3-opacity"></hr>
                    <p>
                        I'm a computer science student studying at UCSB. This website is a small portfolio showing projects I've worked on and work experience that I've been involved with. Before transitioning to Computer Science, I was an animation and gaming major.
                        It was while doing game design that I found my deep love of computer science and software devlopment. I've worked on several game projects which you can take a look at under the portfolio section of this website, along with some Android
                        development and web development.
                    </p>
                    <h2 className="w3-padding-16 w3-text-light-grey">My Skills</h2>
                    <div>
                        <h4 className="w3-wide w3-center">Software Engineering</h4>
                        <p className="w3-wide w3-text w3-center" style={{ paddingTop: '-10px' }}>
                            Desktop Development - Database Interactions - Backend Development
                        </p>
                    </div>
                    <hr className="w3-opacity" />
                    <div>
                        <h4 className="w3-wide w3-center">Mobile Development</h4>
                        <p className="w3-wide w3-text w3-center" style={{ paddingTop: '-10px' }}>
                            Android Experience - Database and Google API Integration - Front and backend Experience
                        </p>
                    </div>
                    <hr className="w3-opacity" />
                    <div>
                        <h4 className="w3-wide w3-center">Mobile Development</h4>
                        <p className="w3-wide w3-text w3-center" style={{ paddingTop: '-10px' }}>
                            Android Experience - Database and Google API Integration - Front and backend Experience
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
