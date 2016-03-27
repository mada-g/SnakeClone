import $ from 'jquery';

import Snake from './Snake';

var updateStats = function(score, highscore){
  $(".current-val").text(score);
  $(".high-val").text(highscore);
}

var snake = new Snake(20,30, updateStats);



$(document).ready(function(){

  snake.init();
  snake.run(70);


})
