import React from 'react';
import MinesweeperBoard from "./MinesweeperBoard.js";
import './App.css';

class App extends React.Component {

  state={
    x:20,
    y:20,
    bombs:50,
    gameOver:false
  }

  gameOver(win, message){
    this.setState({gameOver:true, win:win, message:message});
  }

  newGame(){
    var xElement=document.getElementById("xSize");
    var yElement=document.getElementById("ySize");

    if(parseInt(xElement.value)<parseInt(xElement.min)) xElement.value=Math.ceil(xElement.min);
    if(parseInt(xElement.value)>parseInt(xElement.max)) xElement.value=Math.floor(xElement.max);

    if(parseInt(yElement.value)<parseInt(yElement.min)) yElement.value=Math.ceil(yElement.min);
    if(parseInt(yElement.value)>parseInt(yElement.max)) yElement.value=Math.floor(yElement.max);

    var bombsElement=document.getElementById("bombCount");
    bombsElement.min=xElement.value*yElement.value/20;
    bombsElement.max=xElement.value*yElement.value/2;

    if(parseInt(bombsElement.value)<parseInt(bombsElement.min)) bombsElement.value=Math.ceil(bombsElement.min);
    if(parseInt(bombsElement.value)>parseInt(bombsElement.max)) bombsElement.value=Math.floor(bombsElement.max);

    var x=parseInt(xElement.value);
    var y=parseInt(yElement.value);
    var bombs=parseInt(bombsElement.value);

    this.setState({x:x, y:y, bombs:bombs, restart:true, gameOver:false});
  }

  handleRestart(){
    this.setState({restart: false});
  }

  render(){
    this.newGame=this.newGame.bind(this);
    this.handleRestart=this.handleRestart.bind(this);
    this.gameOver=this.gameOver.bind(this);
    return (
      <div className="App">
        <MinesweeperBoard gameOver={this.gameOver} onRestart={this.handleRestart} restart={this.state.restart} sizeX={this.state.x} sizeY={this.state.y} bombs={this.state.bombs}/>
        <div className="options">
          <label htmlFor="xSize">X: </label>
          <input min={5} max={50} step={1} defaultValue={20} id="xSize" type="number" />
          <label htmlFor="ySize">Y: </label>
          <input min={5} max={30} step={1} defaultValue={20} id="ySize" type="number" />
          <label htmlFor="bombCount">Bombs: </label>
          <input min={5} max={150} step={1} defaultValue={50} id="bombCount" type="number" />
        </div>
        <div className="newGameDiv">
          <button onClick={this.newGame} className="newGame">New game</button>
        </div>
        <div className="homePageDiv">
          <button
            className="homePage"
            onClick={() => window.location.href = 'http://ammarveljagic.me'}
          >
            Back to home page
          </button>
        </div>
        {this.state.gameOver ? <div onContextMenu={(e) => e.preventDefault()} className={this.state.win ? "winMessage" : "gameOverMessage"} style={{top:-this.state.y*15-100+"px", width:this.state.x<10 ? this.state.y*30+"px" : this.state.x*20+"px", height:this.state.y*3+40+"px", lineHeight:this.state.y+10+"px", fontSize:this.state.y+10-this.state.y/6+"px", marginBottom:-this.state.y*15/2+30+"px", marginTop:"10px"}}>{this.state.message}<br /><p onClick={(e)=>this.setState({gameOver:false})} className="hide">Hide</p></div> : ""}
      </div>
    );
  }
}

export default App;
