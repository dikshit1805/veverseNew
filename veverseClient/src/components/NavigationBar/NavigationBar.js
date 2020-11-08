import React, {useState} from 'react'
import "./NavigationBar.css"
import {Link} from "react-router-dom"

import MenuIcon from '@material-ui/icons/Menu';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';

function NavigationBar() {
  const [inputSearch, setInputSearch] = useState("");

  return (
    <div className="navigationbar">
      
      <div className="header_left">
        <MenuIcon className="menuicon"/>
        <Link className="header_left_link" to="/" >
          <h3>Veverse</h3>
        </Link>
      </div>

      <div className="searchbox">
        <input onChange = {e => setInputSearch(e.target.value)} value={inputSearch} placeholder="search" type="text"/>
        <Link className="searchbox_link" to={`/search/${inputSearch}`}>
          <SearchIcon className="searchicon"/>
        </Link>
      </div>
      
      <div className="header_right">
        <VideoCallIcon className="header_right_icon"/>
        <AccountCircleIcon className="header_right_icon"/>
        <ExitToAppIcon className="header_right_icon"/>
      </div>
    </div>
  )
}

export default NavigationBar
