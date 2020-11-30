import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import axios from "../../axios"
import firebase from 'firebase';
// import Progressbar from './../Progressbar/Progressbar';

export default function Signup() {
  const emailRef = useRef()
  const firstRef = useRef()
  const lastRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const {signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [profileName, setProfileName] =  useState(null);

  const handleProfileChange = e => {
    if (e.target.files[0]) {
      setProfileName(e.target.files[0]);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      let emaiID = emailRef.current.value;
      let password = passwordRef.current.value;
      console.log("E1", emaiID, password);
      await signup(emailRef.current.value, passwordRef.current.value)
      console.log("E2", emaiID, profileName.name);
      await firebase.storage().ref(`User/${emaiID}/${profileName.name}`).put(profileName);
      console.log("E3", emaiID, profileName.name);
      let imageURL = await firebase.storage().ref(`User/${emaiID}`).child(`${profileName.name}`).getDownloadURL()
      
      await axios.post("/registeruser", {
        "emailID":`${emailRef.current.value}`,
        "first_name":`${firstRef.current.value}`,
        "last_name":`${lastRef.current.value}`,
        "profile_pic":`${imageURL}`
      })
      
      history.push("/")
    } catch(error) {
      console.log(error)

      setError("Failed to create an account")
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="profileimage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" onChange={handleProfileChange} />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" ref={firstRef} required />
            </Form.Group>
            <Form.Group id="lastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" ref={lastRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  )
}
