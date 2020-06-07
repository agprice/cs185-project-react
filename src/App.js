import React, { Component } from 'react';
import ScrollUpButton from "react-scroll-up-button";
import './css/w3.css'
import './App.css'
import TabList from './components/TabList';
import Body from './components/Body';
import Home from './components/Home';
import Portfolio from './components/Portfolio';
import Images from './components/Images';
import Videos from './components/Videos';
import GuestLog from './containers/GuestLog';
import Movies from './containers/Movies';
import Graph from './components/Graph';
import config from './config.js'

// Setup the firebase reference as global
const firebase = require('firebase')


export class App extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: Home
    }
    this.changeTab = (component) => {
      this.setState({
        activeTab: component
      })
    }
  }

  // Initialize the firebase database on app startup
  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }

  render() {
    const tabs = [
      {
        component: Home,
        title: 'Home',
        icon: 'fa-home'
      },
      {
        component: Portfolio,
        title: 'Portfolio',
        icon: 'fa-folder-open',
      },
      {
        component: Images,
        title: 'Images',
        icon: 'fa-file-image-o'
      },
      {
        component: Videos,
        title: 'Videos',
        icon: 'fa-video-camera'
      },
      {
        component: GuestLog,
        title: 'Guest Log',
        icon: 'fa-book'
      },
      {
        component: Movies,
        title: 'Movies',
        icon: 'fa-film'
      },
      {
        component: Graph,
        title: 'Graph',
        icon: 'fa-area-chart'
      },
    ]
    return (
      <div>
        <ScrollUpButton
          ShowAtPosition={30}
        />
        <TabList tabs={tabs} activeTab={this.state.activeTab} changeTab={this.changeTab} />
        <Body firebase={firebase} changeTab={this.changeTab} activeTab={this.state.activeTab} />
      </div>
    );
  }
}
export default App;