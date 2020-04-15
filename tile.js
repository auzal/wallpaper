class Tile{
  constructor(x, y, w, h){
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.handle_diam = 10;
    this.left_handle = new Handle(this.x - this.w/2, this.y, this.handle_diam);
    this.top_handle = new Handle(this.x , this.y - this.h/2, this.handle_diam);
    this.corner_handle = new Handle(this.x - this.w/2, this.y - this.h/2, this.handle_diam);
  }

  render(){
    push();
    stroke(255,255,0);
    rectMode(CENTER);
    noFill();
    rect(this.x, this.y, this.w, this.h);
    this.renderGui();
    pop();
  }


  renderGui(){
    push();
    strokeWeight(1.5);
    fill(255,255,0,120);
    this.left_handle.render();
    fill(255,255,0,120);
    this.top_handle.render();
    fill(255,255,0,120);
    this.corner_handle.render();
    pop();
  }

  isInside(x, y){
    let inside = false;
      if(x > this.x - this.w/2 && x < this.x + this.w/2){
        if(y > this.y - this.h/2 && y < this.y + this.h/2){
          inside = true;
        }
      }
    return inside;
  }

  checkClick(x,y){
    this.left_handle.checkClick(x,y);
    this.top_handle.checkClick(x,y);
    this.corner_handle.checkClick(x,y);
  }

  release(){
    this.left_handle.release();
    this.top_handle.release();
    this.corner_handle.release();
  }

  update(){
    this.left_handle.setPosition(this.x - this.w/2, this.y);
    this.top_handle.setPosition(this.x , this.y - this.h/2);
    this.corner_handle.setPosition(this.x - this.w/2, this.y - this.h/2);
  }

  drag(x,y, px, py){
    let dx = x - px;
    let dy = y - py;

    // dx /= 2;
    // dy /= 2;

    if(this.top_handle.pressed){
        this.resize(0,dy);
    }
    if(this.left_handle.pressed){
        this.resize(dx,0);
    }
    if(this.corner_handle.pressed){
      this.resize(max(dx,dy),max(dx,dy));

    }
  }

  resize(dx, dy){
    this.w -= dx;
    this.h -= dy;

    this.w = max(this.w, 40);
    this.h = max(this.h, 40);

  }

}
