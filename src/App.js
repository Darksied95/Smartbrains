import React, {Component}from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'
import SignIn from './Components/SignIn/SignIn'
import Register from './Components/Register/Register'


const app= new Clarifai.App({
  apiKey:'4d095d79a9ca400b80f91593d285a60c'
});
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
    this.state={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',//Keep tracks on where we are on the page
      isSignedIn: false
    }
  }

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




  

  //"a403429f2ddf4b49b307e318f00e528b"[Use this below incase of errors]
  app.models
  .predict
    (Clarifai.FACE_DETECT_MODEL,
    this.state.input)
    .then(response =>this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));

};



onRouteChange=(route)=>{
  if(route==='signout'){
    this.setState({isSignedIn: false})
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
      <Rank />
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
      :(
        this.state.route ==='signin'
      ?<SignIn onRouteChange={this.onRouteChange}/>
      :<Register onRouteChange={this.onRouteChange} />
      )
      }
      </div>
  );

}
}
export default App;



