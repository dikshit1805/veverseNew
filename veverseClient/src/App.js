import React from 'react';
import './App.css';
import LeftMenuBar from './components/LeftMenuBar/LeftMenuBar';
import NavigationBar from './components/NavigationBar/NavigationBar';
import VideoBlock from './components/VideoBlock/VideoBlock';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import SearchPage from './components/SearchPage/SearchPage';
import VideoPlayback from './components/VideoPlayback/VideoPlayback';
import Signup from "./components/Login/Signup"
import { useAuth } from "./contexts/AuthContext"
import Login from "./components/Login/Login"
import ForgotPassword from "./components/Login/ForgotPassword"
import UpdateProfile from "./components/Login/UpdateProfile"
import { Container } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"

import Upload from './components/UploadVideo/Upload';




function App() {
  const {currentUser} = useAuth()
  console.log(currentUser);
  return(
    <div className="app">
      <Router>
        
         {currentUser ? 
         <Switch>
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
              <Upload/>
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
          
          <Route path="/update-profile">  
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
              <div className="w-100" style={{ maxWidth: "400px" }}>
                <UpdateProfile/>
              </div>
            </Container>
          </Route>

          <Route path="/">
            <NavigationBar/>
            <div className="app_body">
              <LeftMenuBar/>
              <VideoBlock/>
            </div>
          </Route>
          </Switch>
          :
          <Switch>
          <Route exact path="/signup">  
          <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Signup/>
            </div>
          </Container>
          </Route>

          <Route exact path="/forgot-password">  
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
              <div className="w-100" style={{ maxWidth: "400px" }}>
                <ForgotPassword/>
              </div>
            </Container>
          </Route>

          <Route path="/">   
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
              <Login/>
            </div>
            </Container>
          </Route>
          </Switch>
          }
        
      </Router>
    </div>);
}

export default App;
