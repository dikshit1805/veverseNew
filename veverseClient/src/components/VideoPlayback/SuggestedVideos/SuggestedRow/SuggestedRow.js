import React from 'react'
import "./SuggestedRow.css"

import {Link} from "react-router-dom"
import { Avatar } from '@material-ui/core'        
import  numeral from 'numeral';
import moment from 'moment';
import noimage from '../../../../images/no-image.png'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));


function SuggestedRow({videoID, thumbnail_path, title, views, date, likes, video_path, profile_pic}) {
  const classes = useStyles();
  return (
    <Link className="suggestedRow_link" to={{pathname:`/searchvideo/${videoID}`}}>
      <div className="suggestedRow">
        <div className="suggestedRow__img">  
          <img src={thumbnail_path} alt={noimage}/>
        </div>
        <div className="suggestedRow__text">
          <h3>{title}</h3>
            <div className="suggestedRow__body">
            <div className="suggestedRow__body__img"><Avatar className={classes.small} src={`${profile_pic}`}></Avatar></div>
            <div className="suggestedRow__body__details"><p>{numeral(views).format('0.0a').toUpperCase()} Views •	{numeral(likes).format('0.0a').toUpperCase()} Likes</p> 
                <p>{moment(date.toLocaleTimeString() + ' ' + date.toLocaleDateString(),"h:mm:ss a DD/MM/YYYY").fromNow()}</p></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SuggestedRow
