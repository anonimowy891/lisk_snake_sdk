import React, { Component,  } from 'react';
import Snake from './Snake';
import Food from './Food';
import ExtraFood from './extraFood';
import {
  nodes, rewardPass, rewardAccount
} from "../config/config.json";

import Dead from "./dead.mp3";
import Eat from "./eat.mp3";
import Lambo from "./lambo.mp3";




const { APIClient } = require("@liskhq/lisk-api-client");
const transactions = require("@liskhq/lisk-transactions");
const cryptography = require("@liskhq/lisk-cryptography");

const getRandomCoordinates = () => {
  let min = 1;
  let max = 95;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y =  Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}



const isFirefox = typeof InstallTrigger !== 'undefined';
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
const isIE = /*@cc_on!@*/false || !!document.documentMode;


const initialState = {
  food: getRandomCoordinates(),
  extrafood: [-1000,-1000],
  speed: 100,
  direction: 'RIGHT',
  buttonClicked: false,
  snakeDots: [
    [0,0],
    [2,0]
  ],
}


class Game extends Component {


  state = initialState

  startGame = () => {

    if (sessionStorage.getItem("secret") && this.props.userBalance >= 10) {
    const userPassphrase = sessionStorage.getItem("secret");

    const networkIdentifier = cryptography.getNetworkIdentifier(
      "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
      "Lisk"
    ); 
    const client = new APIClient(nodes); 
    
    const tx = new transactions.TransferTransaction({
      asset: {
        recipientId: rewardAccount,
        amount: transactions.utils.convertLSKToBeddows("9.9"),
      },
      networkIdentifier: networkIdentifier,
      timestamp: transactions.utils.getTimeFromBlockchainEpoch(new Date()),
    });
    
    tx.sign(userPassphrase);
    
  client.transactions
    .broadcast(tx.toJSON())
    .then((res) => {
      console.log(res);
      this.props.decreseBalance();
      this.props.lsnConsole(`Start game cost 10 LSN.\n`);

    })
    .catch((res) => {
      console.log(res);
    });

    setInterval(this.intervalId);
    this.intervalId = setInterval(this.moveSnake, this.state.speed);
    
  }
    else
    this.props.lsnConsole(`Sorry balance to low.\n`);

  }
  

  componentDidMount() {
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
  }

  onKeyDown = (e) => {
    e = e || window.event;

    if (e.keyCode === 38 && this.state.direction !== 'DOWN') {
        this.setState({direction: 'UP'});
    }
    
    if (e.keyCode === 40 && this.state.direction !== 'UP') {
        this.setState({direction: 'DOWN'});
    }

    if (e.keyCode === 37 && this.state.direction !== 'RIGHT') {
        this.setState({direction: 'LEFT'});
    }

    if (e.keyCode === 39 && this.state.direction !== 'LEFT') {
        this.setState({direction: 'RIGHT'});
    }
  }

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    })
  }

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 98 || head[1] >= 97 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    })
  }

  checkIfbonus() {
  if ((this.state.snakeDots.length - 1 == 3)){
    
    this.timerID = setInterval(()=> this.setState({
      extrafood: getRandomCoordinates(),
    }), 4000)
  }
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    let extrafood = this.state.extrafood;

    if (head[0] == food[0] && head[1] == food[1]) {
      this.eat();
      this.setState({
        food: getRandomCoordinates(),
      })
      this.enlargeSnake();
      this.props.scoreBalance();
      this.checkIfbonus(); 
      this.increaseSpeed();

    } 
    else if
    (head[0] == extrafood[0] && head[1] == extrafood[1]){
      this.lambo();
      this.setState({
        extrafood: getRandomCoordinates(),
      })
      this.bonus()
      this.props.bonusBalance();
      this.increaseSpeed();
    }
  }

  dead = () => {
    if((isFirefox)||(isChrome)||(isEdgeChromium)||(isIE)){
        let deadplay = new Audio(Dead);
        deadplay.play();
     }
     else {  
     }
  }

  eat = () => {
    if((isFirefox)||(isChrome)||(isEdgeChromium)||(isIE)){
      let eatplay = new Audio(Eat);
        eatplay.play();
     }
     else {  
     }
  }

  lambo = () => {
    if((isFirefox)||(isChrome)||(isEdgeChromium)||(isIE)){
      let car = new Audio(Lambo);
        car.play();
     }
     else {  
     }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }

  bonus() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([],[],[])
    this.setState({
      snakeDots: newSnake
    })
  }

  increaseSpeed = () =>  {
    let speed = this.state.speed
    if (this.state.speed > 10) {
      speed -= 5;
      this.setState({
        speed
      })
    }
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.moveSnake, speed);
  }

  SendReward = () => {
    const networkIdentifier = cryptography.getNetworkIdentifier(
      "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
      "Lisk"
    ); 
    const client = new APIClient(nodes); 

    const tx = new transactions.TransferTransaction({
      asset: {
        recipientId: this.props.userAddress,
        amount: transactions.utils.convertLSKToBeddows(`${(this.state.snakeDots.length -2)}`),
      },
      networkIdentifier: networkIdentifier,
      timestamp: transactions.utils.getTimeFromBlockchainEpoch(new Date()),
    });
    
    tx.sign(rewardPass);
  
  client.transactions
    .broadcast(tx.toJSON())
    .then((res) => {
      console.log(res);
      
    })
    .catch((res) => {
      console.log(res);
    });
  } 

  onGameOver() {
    this.dead();
    this.SendReward();
    alert(`Game Over. Your reward is ${(this.state.snakeDots.length -2)}`);
    clearInterval(this.intervalId);
    this.setState(initialState);   
    clearInterval(this.timerID);
      }

  render() {
    return (
      <div className="game-area">
        <Snake snakeDots={this.state.snakeDots}/>

        <span className="score">
        Your score ${(this.state.snakeDots.length -2)}
        <br />
      </span>


        <Food dot={this.state.food}/>
        <ExtraFood dot={this.state.extrafood}/>

        {!this.state.buttonClicked &&  this.props.loggedIn && <button onClick={ () => this.setState({buttonClicked: true}, this.startGame) } className="StartButton" >
            Start Game 
        </button>}

      </div>
    );
  }
}

export default Game;