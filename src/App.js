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

  render() {
    const tabs = [
      {
        component: Home,
        title: 'Home'
      },
      {
        component: Portfolio,
        title: 'Portfolio'
      },
      {
        component: Images,
        title: 'Images'
      },
      {
        component: Videos,
        title: 'Videos'
      },
    ]
    return (
      <div>
        <ScrollUpButton
          ShowAtPosition={30}
        />
        <TabList tabs={tabs} activeTab={this.state.activeTab} changeTab={this.changeTab} />
        <Body changeTab={this.changeTab} activeTab={this.state.activeTab} />
      </div>
    );
  }
}
export default App;