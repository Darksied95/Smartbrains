import React, {Component}from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import Rank from './Components/Rank/Rank';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'



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
      imageUrl:''
    }
  }

  //Below is an event listener
  onInputChange = (event) => {
    this.setState({input:event.target.value});
  };

  onButtonSubmit =(event)=>{
  this.setState({imageUrl:this.state.input})
  //"a403429f2ddf4b49b307e318f00e528b"[Use this below incase of errors]
  app.models.predict(Clarifai.COLOR_MODEL,this.state.input).then(
    function(response){
      console.log(response)
    },
    function(err){

    }
  );

}
  render(){
  return (
    <div className="App">
      <Particles className='particles'
            params={particlesOptions}   />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition imageUrl={this.state.imageUrl}/>
    </div>
  );

}
}
export default App;



