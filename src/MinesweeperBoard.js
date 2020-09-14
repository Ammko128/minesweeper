import React from 'react';
import './App.css';

class MinesweeperBoard extends React.Component {

  state={
    buttons:[],
    fields:[],
    marked:0,
    time:0
  }

  restartClasses(){
    var elements=document.getElementsByClassName("marked");
    while(elements[0]){
      elements[0].classList.remove("marked");
    }
    elements=document.getElementsByClassName("revealed");
    while(elements[0]){
      elements[0].classList.remove("revealed");
    }
    elements=document.getElementsByClassName("revealed-bomb");
    while(elements[0]){
      elements[0].classList.remove("revealed-bomb");
    }
    elements=document.getElementsByClassName("clicked-bomb");
    while(elements[0]){
      elements[0].classList.remove("clicked-bomb");
    }
    for(var i=0; i<9; i++){
      elements=document.getElementsByClassName("bombs"+i);
      while(elements[0]){
        elements[0].classList.remove("bombs"+i);
      }
    }
  }

  renderButtons(){
    var buttons=[]
    for(var i=0; i<this.props.sizeY; i++){
      buttons[i]=[];
      for(var j=0; j<this.props.sizeX; j++){
        buttons[i][j] = <div className="field" onContextMenu={(e) => e.preventDefault()} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} id={i+"-"+j} key={i+"-"+j}></div>;
      }
    }
    this.setState({buttons:buttons});
  }

  setFields(){
    var fields=[];
    var bombFields=[];
    var x=0;
    var y=0;
    for(var i=0; i<this.props.bombs; i++){
      var bombPlaced=false;
      while(!bombPlaced){
        bombPlaced=true;
        x=this.getRandomInt(this.props.sizeX);
        y=this.getRandomInt(this.props.sizeY);
        for(var j=0; j<bombFields.length; j++){
          if(bombFields[j][0]===x && bombFields[j][1]===y || (x===0 && (y===0 || y===this.props.sizeY-1)) || (x===this.props.sizeX-1 && (y===0 || y===this.props.sizeY-1))){
            bombPlaced=false;
            break;
          }
        }
      }
        bombFields[i]=[x,y];
    }
    for(i=0; i<this.props.sizeX; i++){
      fields[i]=[];
      for(j=0; j<this.props.sizeY; j++){
        fields[i][j]=0;
        for(var k=0; k<bombFields.length; k++){
          if(i-bombFields[k][0]<=1 && i-bombFields[k][0]>=-1 && j-bombFields[k][1]<=1 && j-bombFields[k][1]>=-1) fields[i][j]+=1;
          if(i===bombFields[k][0] && j===bombFields[k][1]){
            fields[i][j] = "X";
            break;
          }
        }
      }
    }
    this.setState({fields:fields});
    //console.log(fields[0].map((_, colIndex) => fields.map(row => row[colIndex])));

    var time=0;
    this.setState({interval: setInterval(()=>{
      time+=1;
      this.setState({time:time});
    }, 1000)});

    return fields;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  gameOver(){
    for(var i=0; i<this.state.fields.length; i++){
      for(var j=0; j<this.state.fields[i].length; j++){
        if(this.state.fields[i][j]==="X"){
          document.getElementById(j+"-"+i).classList.add("revealed-bomb");
        }
      }
    }
    clearInterval(this.state.interval);
    this.setState({gameOver: true, message:"You clicked on a bomb! Be more careful next time.", win:false});
    this.props.gameOver(false, "You clicked on a bomb! Be more careful next time.");
  }

  revealNeighbors(x,y, fields){
    for(var i=x-1; i<parseInt(x)+2; i++){
      for(var j=y-1; j<parseInt(y)+2; j++){
        var element = document.getElementById(j+"-"+i);
        if(element){
          if(element.classList.contains("revealed")) continue;
          if(element.classList.contains("marked")) {element.classList.remove("marked"); var marked=this.state.marked-1; this.setState({marked:marked});}
          element.classList.add("bombs"+fields[element.id.split("-")[1]][element.id.split("-")[0]]);
          element.classList.add("revealed");
          if(fields[i][j]===0) this.revealNeighbors(i,j, fields);
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.restart !== this.props.restart) {
      if(this.props.restart){
        clearInterval(this.state.interval);
        this.setState({time:0});
        this.renderButtons();
        this.setFields();
        this.restartClasses();
        this.setState({gameOver:false, marked:0});
        this.props.onRestart();
      }
    }
  }

  handleCompletion(){
    clearInterval(this.state.interval);
    var time=this.state.time;
    this.setState({gameOver:true, message: "Congratulations! Completion time: "+time+" sec", win:true});
    this.props.gameOver(true, "Congratulations! Completion time: "+time+" sec");
  }

  componentDidMount(){
    this.handleMouseDown=this.handleMouseDown.bind(this);
    this.handleMouseUp=this.handleMouseUp.bind(this);
    this.handleMouseMove=this.handleMouseMove.bind(this);

    this.renderButtons();
    this.setFields();
  }

  handleMouseDown(e){
    e.preventDefault();
    if(this.state.gameOver){
      return;
    }
    this.setState({clickedField:e.target.id, mouseClicked:true});
  }

  handleMouseMove(e){
    if(!this.state.mouseClicked) return;
    if(this.state.clickedField!==e.target.id) this.setState({clickedField:""});
  }

  handleMouseUp(e){
    e.preventDefault();
    this.setState({mouseClicked:false});
    if(this.state.clickedField!==e.target.id) return;
    if(e.button===0) this.handleLeftClick(e.target);
    else if(e.button===2) this.handleRightClick(e.target);
    if(this.props.sizeX*this.props.sizeY-document.getElementsByClassName("revealed").length===document.getElementsByClassName("marked").length) this.handleCompletion();
  }

  handleLeftClick(element){
    var fields=this.state.fields;
    if(element.classList.contains("revealed") || element.classList.contains("marked")) return;
    if(fields[element.id.split("-")[1]][element.id.split("-")[0]]==="X"){
      if(document.getElementsByClassName("revealed").length===0){
        var notABomb=false;
        while(!notABomb){
          fields = this.setFields();
          notABomb=fields[element.id.split("-")[1]][element.id.split("-")[0]]!=="X";
        }
      }
      else{
        element.classList.add("clicked-bomb");
        this.gameOver();
        return;
      }
    }
    element.classList.add("bombs"+fields[element.id.split("-")[1]][element.id.split("-")[0]]);
    element.classList.add("revealed");
    if(fields[element.id.split("-")[1]][element.id.split("-")[0]]===0) this.revealNeighbors(element.id.split("-")[1], element.id.split("-")[0], fields);
  }

  handleRightClick(element){
    if(element.classList.contains("revealed") || element.classList.contains("revealed-bomb")) return;
    if(element.classList.contains("marked")){
      var marked=this.state.marked-1;
      element.classList.remove("marked");
      this.setState({marked:marked});
    }
    else if(document.getElementsByClassName("marked").length===this.props.bombs){
      return;
    }
    else{
      marked=this.state.marked+1;
      element.classList.add("marked");
      this.setState({marked:marked});
    }
  }

  render(){
    return (
      <div className={this.state.gameOver ? "board gameOver" : "board"} onContextMenu={(e) => e.preventDefault()} style={{paddingBottom:this.props.sizeX<9 ? "60px" : "35px", width:this.props.sizeX*20+"px", height: this.props.sizeY*20+"px"}}>
        <div className="marked-i icon" style={{width:"65px", fontSize:"22px", lineHeight:"25px"}}>{this.props.bombs-this.state.marked < 100 ? this.props.bombs-this.state.marked < 10 ? "00" : "0" : ""}{this.props.bombs-this.state.marked}</div> <div className="time-i icon" style={{display:"inline-block", width:"65px", fontSize:"22px", lineHeight:"25px"}}>{this.state.time < 100 ? this.state.time< 10 ? "00" : "0" : ""}{this.state.time<999 ? this.state.time : "999"}</div>
        <br />
        {this.state.buttons}
      </div>
    );
  }
}

export default MinesweeperBoard;
