import React from 'react'
import {Link} from "react-router-dom"
import MenuRow from './MenuRow/MenuRow'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import HomeIcon from '@material-ui/icons/Home';
import "./LeftMenuBar.css"

function LeftMenuBar() {
  return (
    <div className="leftmenubar">
      <Link className="leftmenubar_link" to="/">
        <MenuRow selected Icon={HomeIcon} title="Home"/>
      </Link>
      <Link className="leftmenubar_link" to="/">
        <MenuRow Icon={PlayArrowIcon} title="Videos"/>
      </Link>
    </div>
  )
}

export default LeftMenuBar
