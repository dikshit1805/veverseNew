import React, { Component } from 'react'
import './Form.css';



// class Form extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             firstName: "",
//             lastName: "",
//             emailID: "",


//         }
//         this.handleSubmit=this.handleSubmit.bind(this)
//     }

//     firsthandler = (event) => {
//         this.setState({
//             firstName: event.target.value
//         })
//     }
//     lasthandler = (event) => {
//         this.setState({
//             lastName: event.target.value
//         })
//     }
//     emailIDhandler = (event) => {
//         this.setState({
//             emailID: event.target.value
//         })
//     }

    

//     handleSubmit = (event) => {
//         alert(`${this.state.firstName} ${this.state.lastName}  Registered Successfully !!!!`)
//         console.log(this.state);
//         this.setState({
//             firstName: "",
//             lastName: "",
//             emailID: "",
//         })
//      event.preventDefault()
        
//     }




//     render() {
//         return (
//             <div>

//                 <form onSubmit={this.handleSubmit}>
//                     <h1>User Registration</h1>
//                     <label>FirstName :</label> <input type="text" value={this.state.firstName} onChange={this.firsthandler} placeholder="FirstName..." /><br />
//                     <label>LastName :</label> <input type="text" value={this.state.lastName} onChange={this.lasthandler} placeholder="LastName..." /><br />
//                     <label>EmailID :</label> <input type="email" value={this.state.emailID} onChange={this.emailIDhandler} placeholder="EmailID..." /><br />
                    
//                     <input type="submit" value="Submit" />
//                 </form>

//             </div>
            
//         )
//     }
// }

// export default Form