import React, {useState} from 'react';
import './App.css';
import LeftMenuBar from './components/LeftMenuBar/LeftMenuBar';
// import NavBar from "./components/NavBar/NavBar"
import NavigationBar from './components/NavigationBar/NavigationBar';
import VideoBlock from './components/VideoBlock/VideoBlock';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom"
import SearchPage from './components/SearchPage/SearchPage';
import VideoPlayback from './components/VideoPlayback/VideoPlayback';
import UploadVideo from './components/UploadVideo/UploadVideo';
import LoginInUser from './components/Login/LoginInUser';

import Signup from "./components/Login/Signup"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Dashboard from "./components/Login/Dashboard"
import Login from "./components/Login/Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./components/Login/ForgotPassword"
import UpdateProfile from "./components/Login/UpdateProfile"
import { Container } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
//import Upload from './components/Upload/Upload';


function App() {
  const {currentUser} = useAuth()
  console.log(currentUser);
  return(
    <div className="app">
      <Router>
        <Switch>
         {currentUser ? 
         <>
          <Route path="/searchvideo/:videoID">
            <NavigationBar/>
            <div className="app_body">
              <VideoPlayback/>
            </div>
          </Route>

          <Route path="/Search/:searchkey">
            <NavigationBar/>
            <div className="app_body">
              <LeftMenuBar/>
              <SearchPage/>
            </div>    
          </Route>

          <Route path="/upload">
            <NavigationBar/>  
            <div className="app_body">
              <LeftMenuBar/>
              {/* <Upload/> */}
            </div>
          </Route>

          <Route path="/signup">  
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
              <div className="w-100" style={{ maxWidth: "400px" }}>
                  <Signup/>
              </div>
            </Container>
          </Route>

          <Route path="/login">  
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
              <div className="w-100" style={{ maxWidth: "400px" }}>
                  <Login/>
              </div>
            </Container>
          </Route>

          <Route path="/forgot-password">  
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
              <div className="w-100" style={{ maxWidth: "400px" }}>
                <ForgotPassword/>
              </div>
            </Container>
          </Route>

          <Route exact path="/">
            <NavigationBar/>
            <div className="app_body">
              <LeftMenuBar/>
              <VideoBlock/>
            </div>
          </Route>
          </>
          :
          <Route path="/">   
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
              <Login/>
            </div>
            </Container>
            <Redirect to="/"/>
          </Route>
          }
        </Switch>
      </Router>
    </div>);
}

export default App;
