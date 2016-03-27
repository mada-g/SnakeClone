function Square(row, column, size){
  this.state = "empty";
  this.row = row;
  this.column = column;
  this.size = size;
}

Square.prototype = {
  row: 0,
  column: 0,
  size: 10,
  state: 'empty',

  render: function(){
    return `<div id="${this.row}-${this.column}" class="square ${this.state}" style="top:${this.row*20}px; left:${this.column*20}px; height:${this.size}px; width:${this.size}px"></div>`;
  },

  setState: function(state){
    this.state = state;
  },

}

export default Square;
