import $ from 'jquery';

import {modulus} from './utils';

import Grid from './Grid';

var containercolumn = 600;

function Snake(row, column, updateStats){
  this.row = row;
  this.column = column;
  this.updateStats = updateStats;

  var size = containercolumn / column;
  this.grid = new Grid(row, column, size);

}

Snake.prototype = {
  alive: true,
  intervalID: null,
  grid: [[]],
  snakeInit: [[5,5],[5,6],[5,7],[5,8]],
  snakeLoc: [],
  food: [0,0],
  direction: 'right',
  preDirection: 'right',
  score: 0,
  high: 0,
  updateStats: null,

  init: function(){

    $('.content').remove();
    $('.game').append('<div class="content"></div>')
    $('.content').append(this.grid.clear());

    var arr = [];
    this.snakeInit.forEach((elem) => {
      arr.push(elem);
    })
    this.snakeLoc = arr;

    this.score = 0;
    this.alive = true;
    this.direction = 'right';
    this.preDirection= 'right';

    this.snakeLoc.forEach((segment) => {
      this.grid.update(segment, 'snake');
    })

    this.placeFood();
    this.updateStats(this.score, this.high);
  },

  placeFood: function(){
    var row = Math.floor(Math.random() * this.row);
    var col = Math.floor(Math.random() * this.column);

    var positionOK = true;

    if(row >= this.row || col >= this.column || (row === this.food[0] && col === this.food[1]))
      positionOK = false;
    else{
      this.snakeLoc.forEach((elem) => {
        if(elem[0] === row && elem[1] === col)
          positionOK = false;
      });
    }

    if(!positionOK){
      this.placeFood();
    }
    else{
      console.log('OK FOOD ' + row + ", " + col );
      this.food = [row, col];
      this.grid.update(this.food, 'food');
    }
  },

  getNewHead: function(head, dir){
    switch (dir) {
      case "right": {
        return [head[0], modulus(head[1]+1, this.column)];
      }

      case "left": {
        return [head[0], modulus(head[1]-1, this.column)];
      }

      case "up": {
        return [modulus(head[0]-1, this.row), head[1]];
      }

      case "down": {
        return [modulus(head[0]+1, this.row), head[1]];
      }

      default:{
        return head
      }

    }
  },

  isFood: function(newHead){
    if(this.food[0] == newHead[0] && this.food[1] == newHead[1])
      return true;
    else
      return false;
  },

  isDead: function(newHead){
    var dead = false;
    this.snakeLoc.forEach((elem) => {
      if(elem[0] == newHead[0] && elem[1] == newHead[1])
          dead = true;
    })
    return dead;
  },

  move: function(dir){
    var head = this.snakeLoc[this.snakeLoc.length-1];
    var newHead = this.getNewHead(head, dir);

    if(!this.isFood(newHead)){
      this.grid.update(this.snakeLoc[0], 'empty');
      this.snakeLoc.shift();
    }
    else{
      this.score += 10;
      this.grid.update(this.food, 'empty');
      this.placeFood();
      this.updateStats(this.score, this.high);
    }

    if(this.isDead(newHead)){
      this.grid.update(newHead, 'collision');
      clearInterval(this.intervalID);
      this.high = (this.score > this.high) ? this.score : this.high;
      this.updateStats(this.score, this.high);
      return false;
    }
    else{
      this.grid.update(newHead, 'snake');
      this.snakeLoc.push(newHead);
      return true;
    }

  },

  gameOver: function(){
    this.game_over = true;
  },

  start: function(deltaT){
    this.intervalID = setInterval(() => {

      this.direction = this.preDirection;
      this.alive = this.move(this.direction);

    }, deltaT);
  },

  run: function(deltaT){

    this.start(deltaT);

    $(document).keydown((event) => {
      if(event.keyCode === 32 && !this.alive)
      {
        this.init();
        this.start(deltaT);
      }
    })

    $(document).keypress((event) =>{
      switch (event.keyCode) {
        case 37: {
          if(this.direction !== 'right')
            this.preDirection = "left";
          break;
        }
        case 38: {
          if(this.direction !== 'down')
            this.preDirection = "up";
          break;
        }
        case 39: {
          if(this.direction !== 'left')
            this.preDirection = "right";
          break;
        }
        case 40: {
          if(this.direction !== 'up')
            this.preDirection = "down";
          break;
        }
      }

    })

  }

}

export default Snake;
