import React from 'react';
import './App.css';
import LeftMenuBar from './components/LeftMenuBar/LeftMenuBar';
// import NavBar from "./components/NavBar/NavBar"
import NavigationBar from './components/NavigationBar/NavigationBar';
import VideoBlock from './components/VideoBlock/VideoBlock';

import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import SearchPage from './components/SearchPage/SearchPage';
import VideoPlayback from './components/VideoPlayback/VideoPlayback';

function App() {
  return (
    <div className="app">
      <Router>
        <NavigationBar/>
        <Switch>
          <Route path="/searchvideo/:videoID">
            <div className="app_body">
              <VideoPlayback/>
            </div>
          </Route>
          <Route path="/Search/:searchkey">
          <div className="app_body">
              <LeftMenuBar/>
              <SearchPage/>
          </div>
          </Route>
          <Route path="/">
            <div className="app_body">
              <LeftMenuBar/>
              <VideoBlock/>
            </div>
          </Route>
        </Switch>

      </Router>
    </div>
  );
}

export default App;
