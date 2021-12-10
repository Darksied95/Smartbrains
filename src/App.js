import React, {Component}from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'
import SignIn from './Components/SignIn/SignIn'
import Register from './Components/Register/Register'



const initialState={
    input:'',
    imageUrl:'',
    box:{},
    route:'signin',//Keep tracks on where we are on the page
    isSignedIn: false,
    user: {
      id : '',
      name : '' ,
      email: '',
      entries: 0,
      joined : ''
    }
  }
const particlesOptions={
  particles: {
    number:{
      value:30,
      density:{
        enable:true,
        value_are:800
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }};

class App extends Component {
  constructor(){
    super();
    this.state=initialState;
  }
  loadUser = (data) =>{
    this.setState({user:{
      id: data.id,
      name: data.name,
      email:data.email,
      entries:data.entries,
      joined: data.joined
    }})}

  calculateFaceLocation = (data) =>{
   const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
   const image =document.getElementById('inputimage');
   const width=Number(image.width);
   const height=Number(image.height);
   return{
     leftCol:clarifaiFace.left_col * width,
     topRow:clarifaiFace.top_row*height,
     rightCol:width -(clarifaiFace.right_col*width),
     bottomRow:height -(clarifaiFace.bottom_row *height),
   }
  };

  displayFaceBox =(box) =>{
    this.setState({box:box});
  }


  //Below is an event listener
  onInputChange = (event) => {
    this.setState({input:event.target.value});
  };

  onButtonSubmit =(event)=>{
  this.setState({imageUrl:this.state.input})
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': ' application/json'},
      body : JSON.stringify({
          input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response =>{
      if(response){
      fetch('http://localhost:3000/image', {
        method: 'put',
        headers: {'Content-Type': ' application/json'},
        body : JSON.stringify({
            id: this.state.user.id
        })
      })
      .then(response => response.json())
      .then(count =>{
        this.setState(Object.assign(this.state.user, {entries: count}))
      })
      .catch(console.log);
      }
    this.displayFaceBox(this.calculateFaceLocation(response))
  })
    .catch(err => console.log(err));

};



onRouteChange=(route)=>{
  if(route==='signout'){
    this.setState(initialState)
  }else if (route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route:route});
};

  render(){
  return (
    <div className="App">
      <Particles className='particles'
            params={particlesOptions}   />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
      {this.state.route==='home'
      ?<div><Logo />
      <Rank name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
      :(
        this.state.route ==='signin'
      ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      )
      }
      </div>
  );

}
}
export default App;



