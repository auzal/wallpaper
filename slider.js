class Slider{

  constructor(min, max){
    this.x = 0 ;
    this.y = 0;
    this.h = 13;
    this.w = 127/2;
    this.min = min;
    this.max = max;
    this.pressed = false;
    this.x_slider = this.x;
    this.value = 0;
    this.color = color(0,0,0);
    this.randomize();
  }

  setDimensions(w, h){
    this.w = w;
    this.h = h;
  }

  setPosition(x,y){
    this.x = x;
    this.y = y;
    this.x_slider = this.x;
    this.randomize();
  }

  render(){
    // push();
    // noStroke();
    // fill(40);
    // rect(this.x - this.h/2, this.y, this.w + this.h, this.h, this.h/2);
    // fill(this.color);
    // rect(this.x - this.h/2, this.y, this.x_slider - this.x + this.h/2, this.h, this.h/2, 0, 0, this.h/2);
    // stroke(0);
    // noFill();
    // rect(this.x - this.h/2, this.y, this.w + this.h, this.h, this.h/2);
    //
    // noStroke();
    // fill(49,	158,	149);
    // ellipse(this.x_slider, this.y + this.h/2, this.h*0.6);
    // pop();
    push();
    stroke(49,	158,	149);
    line(this.x, this.y + this.h/2, this.x + this.w, this.y + this.h/2);

    //noStroke();
    fill(0);
    ellipse(this.x_slider, this.y + this.h/2, this.h*0.6);
    pop();
  }

  update(){
    if(this.pressed){
      this.x_slider = mouseX;
      this.x_slider = constrain(this.x_slider, this.x, this.x + this.w);
    }
    this.value = map(this.x_slider, this.x, this.x + this.w, this.min, this.max);
  }

  getValue(){
    return this.value;
  }

  release(){
    this.pressed = false;
  }

  checkClick(x, y){
    if(dist(x, y, this.x_slider, this.y) < this.h*0.7){
      this.pressed = true;
    }else if(x > this.x && x < this.x + this.w){
      if(y > this.y + this.h/2 - this.h*0.5 && y < this.y + this.h/2 + this.h*0.5){
        this.x_slider = x;
        this.x_slider = constrain(this.x_slider, this.x, this.x + this.w);
        this.pressed = true;
      }
    }
  }

  setColor(c){
    this.color = c;
  }

  randomize(){
    this.x_slider = random(this.x, this.x + this.w);
  }

}

//••••••••••••••••••••••••••••••••••••••••••••••

class Panel{
  constructor(){
    this.margin = 15;
    this.font_size = 16;
    push();
    textFont(font);
    textSize(this.font_size);
    this.w = textWidth('descargar') + this.margin * 2;
    this.reset_w = textWidth('reset');
    this.download_w = textWidth('descargar');
    this.about_w = textWidth('acerca de');
    print(this.w);
    pop();
    this.h = 145;
    this.x = width - this.w;
    this.y = height/2 - this.h/2;
    this.r = new Slider(0,255);
    this.g = new Slider(0,255);
    this.b = new Slider(0,255);

    this.r.setPosition(this.x + this.margin, this.y + 10);
    this.g.setPosition(this.x + this.margin, this.y + 30);
    this.b.setPosition(this.x + this.margin, this.y + 50);

    this.r.setDimensions(this.w - this.margin * 2, 13);
    this.g.setDimensions(this.w - this.margin * 2, 13);
    this.b.setDimensions(this.w - this.margin * 2, 13);

    this.x_reset = this.x + this.margin;
    this.y_reset = this.y + 75;
    this.x_download = this.x + this.margin;
    this.y_download = this.y + 100;

    this.x_about = this.x + this.margin;
    this.y_about = this.y + 125;

    this.reset_hover = false;
    this.download_hover = false;
    this.reset_flag = false;
    this.download_flag = false;
    this.about_hover = false;

  }

  update(){
    this.r.update();
    this.g.update();
    this.b.update();

    this.r.setColor(color(this.r.getValue(),0,0));
    this.g.setColor(color(0,this.g.getValue(),0));
    this.b.setColor(color(0,0,this.b.getValue()));

    this.checkHover();
  }

  render(){
    push();
    rectMode(CORNER);
    fill(20,240);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 10, 0, 0, 10);
    this.r.render();
    this.g.render();
    this.b.render();

    textFont(font);
    textSize(this.font_size);
    textAlign(LEFT, CENTER);
    fill(49,	158,	149);
    if(this.reset_hover){
      fill(154,	123,	32);
    }
    text("reset", this.x_reset, this.y_reset);

    fill(49,	158,	149);
    if(this.download_hover){
      fill(154,	123,	32);
    }
    text("descargar", this.x_download, this.y_download);

    fill(49,	158,	149);
    if(this.about_hover){
      fill(154,	123,	32);
    }
    text("acerca de", this.x_about, this.y_about);

    //line();
    pop();
  }

  checkClick(x, y){
    this.r.checkClick(x, y);
    this.g.checkClick(x, y);
    this.b.checkClick(x, y);

    if(this.reset_hover){
      this.reset_flag = true;
    }

    if(this.download_hover){
      this.download_flag = true;
    }

    if(this.about_hover){
      window.open("https://auzal.net/");
    }
  }

  release(){
    this.r.release();
    this.g.release();
    this.b.release();
  }

  randomizeSliders(){
    this.r.randomize();
    this.g.randomize();
    this.b.randomize();
  }

  getColor(){
    let c = color(this.r.getValue(), this.g.getValue(), this.b.getValue());
    return c;
  }

  checkHover(){
    if(mouseX > this.x_reset && mouseX < this.x_reset + this.reset_w){
      if(mouseY > this.y_reset && mouseY < this.y_reset + this.font_size * 0.7 ){
        this.reset_hover = true;
      }else{
        this.reset_hover = false;
      }
    }else{
      this.reset_hover = false;
    }
    if(mouseX > this.x_download && mouseX < this.x_download + this.download_w){
      if(mouseY > this.y_download && mouseY < this.y_download + this.font_size * 0.7){
        this.download_hover = true;
      }else{
        this.download_hover = false;
      }
    }else{
      this.download_hover = false;
    }

    if(mouseX > this.x_about && mouseX < this.x_about + this.about_w){
      if(mouseY > this.y_about && mouseY < this.y_about + this.font_size * 0.7){
        this.about_hover = true;
      }else{
        this.about_hover = false;
      }
    }else{
      this.about_hover = false;
    }
  }

  lowerResetFlag(){
    this.reset_flag = false;
  }

  lowerDownloadFlag(){
    this.download_flag = false;
  }

}
