class Handle{

  constructor(x, y, diam){
    this.x = x;
    this.y = y;
    this.pressed = false;
    this.diam = diam;
  }

  release(){
    this.pressed = false;
  }

  render(){
    strokeWeight(1.5);
    push();
    stroke(20,128);
    noFill();

    ellipse(this.x + 1, this.y + 1 , this.diam);
    pop();
    if(!this.pressed){
      noFill();
    }
    ellipse(this.x, this.y, this.diam);
  }

  checkClick(x, y){
    this.pressed = false;
    if(dist(x, y , this.x, this.y) < this.diam/2){
      this.pressed = true;
    }

    return this.pressed;
  }

  setPressed(){
    this.pressed = true;
  }

  setPosition(x, y){
    this.x = x;
    this.y = y;
  }

}
