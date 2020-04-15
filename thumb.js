class Thumb{
  constructor(x, y, w, h, img, index){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.pressed = false;
    this.create_flag = false;
    this.hover = false;
    let img_w = int(w);
    let img_h = int(img.height * w / img.width);
    if(img_h > h){
       img_h = int(h);
       img_w = int(img.width * h / img.height);
    }
    this.img = createImage(img.width, img.height);
    this.img.copy(img, 0, 0, img.width, img.height, 0, 0, this.img.width, this.img.height);
    this.img.resize(img_w,img_h);
    this.ready_to_load = false;
    this.img_index = index;
  }

  render(){
    push();
    rectMode(CENTER);
    strokeWeight(1);
    //noFill();
    if(this.hover){
      fill(49,	158,	149, 128);
    }else{
      fill(0,0);
    }
    stroke(128);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 5);
    imageMode(CENTER);
    image(this.img, this.x, this.y);
    pop();
  }

  update(){
    if(this.isInside(mouseX,mouseY)){
      this.hover = true;
    }else{
      this.hover = false;
    }

  }

  lowerFlag(){
    this.create_flag = false;
  }

  raiseFlag(){
    this.create_flag = true;
  }

  checkClick(x, y){
    if(x > this.x - this.w/2 && x < this.x + this.w/2){
      if(y > this.y - this.h/2 && y < this.y + this.h/2){
        this.pressed = true;
        this.raiseFlag();
      }
    }
    return this.pressed;
  }

  isInside(x,y){
    let inside = false;
    if(x > this.x - this.w/2 && x < this.x + this.w/2){
        if(y > this.y - this.h/2 && y < this.y + this.h/2){
          inside = true;
        }
    }
    return inside;
  }

  release(){
    this.pressed = false;
  }
}
