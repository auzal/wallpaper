class Stamp{

  constructor(img_, x, y){
    this.x = x;
    this.y = y;
    this.img = img_;
    this.handle_diam = 10;
    this.w = this.img.width/3;
    this.h = this.img.height/3;
    //  this.move_handle = new Handle(this.x, this.y, this.handle_diam);
    this.size_handle = new Handle(this.x - this.w/2 , this.y - this.h/2, this.handle_diam);
    this.rotate_handle = new Handle(this.x + this.w/2, this.y, this.handle_diam);
    this.ang = 0;

    this.inside_tile = false;

    this.highlight_scale = 1.2;
    this.highlight_margin = 10;

    this.img_highlight = createImage(int(this.img.width * this.highlight_scale), int(this.img.height * this.highlight_scale));
    this.processImage();

    this.dropped = false;
    //  this.move_handle.setPressed();
    this.kill_flag = false;
    this.scale_x = 1;
    this.scale_y = 1;

    this.original_w = this.w;
    this.original_h = this.h;

    this.hover = false;
    this.pressed = true;
    this.selected = false;
    this.dx = 0;
    this.dy = 0;
  }

  render(){
    push();
    imageMode(CENTER);
    rectMode(CENTER);
    translate(this.x, this.y);
    noFill();
    stroke(255,0,0);
    //  rect(0,0, this.w , this.h); //**
    rotate(this.ang);
    //  rect(0,0,this.w * this.highlight_scale, this.h * this.highlight_scale);
    tint(20,	224,	239, 128	);
    scale(this.scale_x, this.scale_y);
    if(this.hover)
    image(this.img_highlight, 0,0, abs(this.w) * this.highlight_scale + this.highlight_margin, abs(this.h)  * this.highlight_scale + this.highlight_margin);
    noTint();
    if(!this.inside_tile)
    tint(255,90);
    image(this.img,0,0, this.w , this.h);
    //  rect(0,0, this.w , this.h); // **
    pop();
    scale(1,1);
    this.renderGui();

  }

  renderAtZero(){
    push();
    imageMode(CENTER);
    rotate(this.ang);
    scale(this.scale_x, this.scale_y);
    image(this.img,0,0, this.w , this.h);
    pop();
  }

  renderExportAtZero(g){
    g.push();
    g.imageMode(CENTER);
    g.rotate(this.ang);
    g.scale(this.scale_x, this.scale_y);
    g.image(this.img,0,0, this.w , this.h);
    g.pop();
  }


  renderGui(){
    push();
    strokeWeight(1.5);
    stroke(182,	69,	31);
    fill(182,	69,	31,128);
    //  this.move_handle.render();
    fill(182,	69,	31,128);
    this.size_handle.render();
    fill(182,	69,	31,128);
    this.rotate_handle.render();
    translate(this.x, this.y);
    rotate(this.ang);
    push();
    stroke(20,128);
    if(this.scale_x > 0)
    line(this.w/4, 0+1, this.w/2 - this.handle_diam/2, 0+1);
    else
    line(this.w/4, 0+1, this.w/2 + this.handle_diam/2, 0+1);

    pop();
    if(this.scale_x > 0)
    line(this.w/4, 0, this.w/2 - this.handle_diam/2, 0);
    else
    line(this.w/4, 0, this.w/2 + this.handle_diam/2, 0);

    this.renderScaleGuide();

    pop();
  }

  setPosition(x, y){
    this.x = x - this.dx;
    this.y = y - this.dy;
  }

  update(){
    this.setHandlePositions();
    this.checkHover();

  }

  setHandlePositions(){
    //  this.move_handle.setPosition(this.x, this.y);

    let aux_x = this.x;
    let aux_y = this.y;
    aux_x += cos(this.ang) * this.w/2;
    aux_y += sin(this.ang) * this.w/2;
    this.rotate_handle.setPosition(aux_x, aux_y);

    aux_y = this.y;
    aux_x = this.x;
    let rad = sqrt(sq((this.w/2)) + sq((this.h/2)));
    let aux_ang = atan2((this.y - this.h/2) - this.y,(this.x - this.w/2) - this.x);
    aux_x += cos(this.ang + aux_ang) * rad;
    aux_y += sin(this.ang + aux_ang) * rad;
    this.size_handle.setPosition(aux_x, aux_y);
  }

  checkMouse(x, y){
    let click = false;
    if(!this.size_handle.checkClick(x,y)){
      if(!this.rotate_handle.checkClick(x,y)){
        if(this.hover){
          this.pressed = true;
          this.dx = x - this.x;
          this.dy = y - this.y;
          click = true;
        }
      }else{
        click = true;
      }
    }else{
      click = true;
    }
    return click;
  }

  move(dx, dy){
    this.x += dx;
    this.y += dy;
  }

  release(){
    //  this.move_handle.release();
    this.size_handle.release();
    this.rotate_handle.release();
    this.pressed = false;
    if(!this.inside_tile){
      this.kill_flag = true;
    }
  }

  drag(x,y, px, py){
    if(this.pressed){
      this.setPosition(x,y);
    }else if(this.size_handle.pressed){
      if(shift_down){
        let dx = x - px;
        let dy = y - py;
        this.resizeProportional(x,y);
      }else{
        this.resize(x,y);
    }
    }else if(this.rotate_handle.pressed){
      this.rotate(x,y);
    }
  }

  rotate(x, y){

    this.ang = atan2(y - this.y, x - this.x);
    if(this.scale_x == -1){
      this.ang += PI;
    }
  }


  resize(x,y){
    let ang = atan2(y-this.y, x-this.x) - this.ang;
    this.w = - (cos(ang) * dist(x,y,this.x,this.y)) * 2;
    this.h = - (sin(ang) * dist(x,y,this.x,this.y)) * 2;

    if(this.w > 0){
      this.scale_x = 1;
    }else{
      this.scale_x = -1;
    }
    if(this.h > 0){
      this.scale_y = 1;
    }else{
      this.scale_y = -1;
    }
  }

  resizeProportional(x,y){
    let original_dist = dist(this.x, this.y, this.x-this.original_w/2, this.y - this.original_h/2);
    let dista = dist(this.x, this.y, x, y);

    let mag =  dista / original_dist;

    this.w = this.original_w * mag;
    this.h = this.original_h * mag;

    let ang_mouse = atan2(y-this.y, x-this.x);
  //  let dist = dist(mouseX, mouseY, x, y);

  let mx = this.x + cos(ang_mouse - this.ang) * dista;
  let my = this.y + sin(ang_mouse - this.ang) * dista;

    if(my > this.y){
      this.h*=-1;
    }

    if(mx > this.x){
      this.w*=-1;
    }

    if(this.w > 0){
      this.scale_x = 1;
    }else{
      this.scale_x = -1;
    }
    if(this.h > 0){
      this.scale_y = 1;
    }else{
      this.scale_y = -1;
    }

  }

  setInTile(inside){
    this.inside_tile = inside;
  }

  processImage(){
    let w = this.img_highlight.width;
    let h = this.img_highlight.height;
    let margin = (this.highlight_scale - 1)/2;
    this.img_highlight.copy(this.img, 0, 0, int(this.img.width), int(this.img.height), int(0 + margin * this.img.width), int(0 + margin * this.img.height), int(this.img.width), int(this.img.height));
    this.img_highlight.filter(THRESHOLD,255);
    this.img_highlight.filter(INVERT);
    this.img_highlight.filter(DILATE);
    this.img_highlight.filter(DILATE);
    this.img_highlight.filter(DILATE);
    this.img_highlight.filter(BLUR, 3);
  }

  renderScaleGuide(){
    let aux_ang = atan2(this.y- this.original_h/2 * this.scale_y - this.y,  this.x - this.original_w/2 * this.scale_x - this.x);
    push();
    rotate(aux_ang);
    push();
    stroke(20, 128);
    translate(0,1);
    dashedLine(dist(this.x, this.y, this.size_handle.x, this.size_handle.y),10);
    pop();
    dashedLine(dist(this.x, this.y, this.size_handle.x, this.size_handle.y),10);
    pop();
  }


  checkHover(){
    let rad = dist(mouseX, mouseY, this.x, this.y);
    let ang_init = atan2(mouseY - this.y, mouseX - this.x);
    let x = this.x +  cos(this.ang - ang_init) * rad;
    let y = this.y - sin(this.ang - ang_init) * rad;

  //  ellipse(x,y,10);

    let  w = abs(this.w);
    let  h = abs(this.h);

    if(x > this.x - w/2 && x < this.x + w/2){
      if(y > this.y - h/2 && y < this.y + h/2){
        let x_sample = map(x,this.x - w/2, this.x + w/2, 0.0, 1.0);
        let y_sample = map(y,this.y - h/2, this.y + h/2, 0.0, 1.0);
        this.hover = this.checkIsInsideNorm(x_sample, y_sample);

        //noFill();
      //  ellipse(x,y,10,10);
        //  print(this.ang);
      }else{
        this.hover = false;
      }
    }
    else{
      this.hover = false;
    }
  }

  checkIsInsideNorm(nx,ny){
    //  print(y);
    let is_inside = false;

    let x = int(nx * this.img.width);
    let y = int(ny * this.img.height);

    if(this.scale_x < 0){
      x = this.img.width - x;
    }

    if(this.scale_y < 0){
      y = this.img.height - y;
    }

    let op = alpha(this.img.get(x, y));

    if(op > 0){
      is_inside = true;
    }
    //  fill();
    //  print(y);
    return is_inside;
  }
}
