let imgs = [];
let stamps = [];
let thumbs = [];

let thumb_margin;

let panel;


let load_img = null;
let thumb_index_change = 0;
let waiting_for_image = false;
let font;

let render_ui = true;
let last_action = 0;
let ui_timeout = 4000;

let shift_down = false

function preload(){
  font = loadFont('assets/Roboto-Light.ttf');
  for(let i = 0 ; i < 6 ; i++){
    let filename = 'assets/' + (i+1) + '.png';
    let img = loadImage(filename);
    imgs.push(img);
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);

  for(let i = 0 ; i < imgs.length ; i++){
    imgs[i].resize(0,600);
  }
  t = new Tile(width/2, height/2, 300, 300);
  thumb_margin = width/80;
  createThumbs();

  panel = new Panel();

  canvas.drop(gotFile);
}

function draw() {

  background(panel.getColor());

  if(render_ui){
    t.render();
    t.update();
  }
  renderGrid();

  for(let i = stamps.length -1 ; i >= 0 ; i--){
    if(stamps[i].kill_flag){
      stamps.splice(i,1);
    }
  }

  for(let i = 0 ; i < stamps.length ; i ++){

    stamps[i].setInTile(t.isInside(stamps[i].x, stamps[i].y));
    stamps[i].update();
    if(render_ui)
      stamps[i].render();
  }

  if(render_ui)
  renderThumbsBg();

  for(let i = 0 ; i < thumbs.length ; i++){
    thumbs[i].update();
    if(render_ui)
    thumbs[i].render();
    if(thumbs[i].create_flag){
      let aux = new Stamp(imgs[thumbs[i].img_index], mouseX, mouseY);
      stamps.push(aux);
      thumbs[i].lowerFlag();
    }
  }

  if(render_ui)
  panel.render();
  panel.update();

  if(waiting_for_image){
    if (load_img.width > 1) {
      print(load_img.width);
      load_img.resize(0,600);
      imgs.push(load_img);
      thumbs[thumb_index_change] = new Thumb(thumbs[thumb_index_change].x, thumbs[thumb_index_change].y, thumbs[thumb_index_change].w, thumbs[thumb_index_change].h, imgs[imgs.length-1],imgs.length-1);
      waiting_for_image = false;
    }
  }

  if(panel.reset_flag){
    stamps = [];
    panel.lowerResetFlag();
    t = new Tile(width/2, height/2, 300, 300);
    panel.randomizeSliders();
  }

  if(panel.download_flag){
    renderAndSave();
    panel.lowerDownloadFlag();
  }

  if(millis() - last_action > ui_timeout){
    hideUi();
  }


}

function mouseMoved(){
    showUi();
}

function mousePressed(){

  showUi();

  panel.checkClick(mouseX, mouseY);
  t.checkClick(mouseX,mouseY);
  let thumb_pressed = false;
  for(let i = 0 ; i < thumbs.length ; i++){
    if(thumbs[i].checkClick(mouseX, mouseY)){
      thumb_pressed = true;
    }
  }

  if(!thumb_pressed){
    for(let i = stamps.length-1 ; i >=0; i--){
      if(stamps[i].checkMouse(mouseX, mouseY)){
        break;
      }
    }
  }

}

function mouseDragged(){

    showUi();

  for(let i = 0 ; i < stamps.length ; i++){
    stamps[i].drag(mouseX, mouseY, pmouseX, pmouseY);
  }
  t.drag(mouseX, mouseY, pmouseX, pmouseY);

}

function mouseReleased(){
  panel.release();
  t.release();
  for(let i = 0 ; i < thumbs.length ; i++){
    thumbs[i].release();
  }
  for(let i = 0 ; i < stamps.length ; i++){
    stamps[i].release();
  }
}

function createThumbs(){

  let w = (width - thumb_margin * (imgs.length+1))/imgs.length;
  if(w > 80){
    w = 80;
  }
  let x = w/2 + ( width/2 -  ((w * 6 + thumb_margin *5)/2));
  let h = w;
  for(let i = 0 ; i < imgs.length ; i++){
    let aux = new Thumb(x, h/2 + thumb_margin, w, h, imgs[i], i);
    thumbs.push(aux);
    x += w;
    x += thumb_margin;
  }
}

function renderGrid(){
  let x;
  let y;
  for(let i = t.x ; i > 0 - t.w ; i-= t.w){
    x = i;
  }
  for(let i = t.y ; i > 0 - t.h ; i-= t.h){
    y = i;
  }

  for( let i = x ; i < width + t.w; i += t.w){
    for( let j = y ; j < height + t.h ; j += t.h){
      for(let k = 0 ; k < stamps.length ; k++){
        if(t.isInside(stamps[k].x, stamps[k].y)){
          let x_img = stamps[k].x - t.x;
          let y_img = stamps[k].y - t.y;
          push();
          translate(i,j);
          translate(x_img, y_img);
          stamps[k].renderAtZero();
          pop();
        }
      }
    }
  }
}

function renderExportGrid(g){
  let x;
  let y;
  for(let i = g.width/2 ; i > 0 - t.w ; i-= t.w){
    x = i;
  }
  for(let i = g.height/2 ; i > 0 - t.h ; i-= t.h){
    y = i;
  }

  for( let i = x ; i < g.width + t.w; i += t.w){
    for( let j = y ; j < g.height + t.h ; j += t.h){
      for(let k = 0 ; k < stamps.length ; k++){
        if(t.isInside(stamps[k].x, stamps[k].y)){
          let x_img = stamps[k].x - t.x;
          let y_img = stamps[k].y - t.y;
          g.push();
          g.translate(i,j);
          g.translate(x_img, y_img);
          stamps[k].renderExportAtZero(g);
          g.pop();
        }
      }
    }
  }
}

function renderExportTile(g){
  for( let i = -g.width ; i < g.width * 2 ; i += t.w){
    for( let j = -g.height ; j  < g.height * 2 ; j += t.h){
      for(let k = 0 ; k < stamps.length ; k++){
        if(t.isInside(stamps[k].x, stamps[k].y)){
          let x_img = stamps[k].x - t.x + t.w/2;
          let y_img = stamps[k].y - t.y + t.h/2;
          g.push();
          g.translate(i,j);
          g.translate(x_img, y_img);
          stamps[k].renderExportAtZero(g);
          g.pop();
        }
      }
    }
  }
}

function renderThumbsBg(){
  //let x = thumbs[0].x;
  let w = (thumbs[0].w + thumb_margin) * thumbs.length + thumb_margin;
  let h = thumbs[0].h + thumb_margin * 2;

  push();
  fill(20,240);
  noStroke();
  rectMode(CENTER);
  rect(width/2, h/2, w, h, 0,0,10,10);
  pop();

}


function dashedLine(l, dash_l){
  for(let i = 0 ; i < l ; i += dash_l * 2){
    line(i,0,i+dash_l,0);
  }
}

function keyPressed(){
  if(keyCode === SHIFT){
    shift_down = true;
  }
}

function keyReleased(){
  if(keyCode === SHIFT){
    shift_down = false;
  }
}


function renderAndSave(){
  let g = createGraphics(width, height);
  g.background(panel.getColor());
  renderExportGrid(g);
  save(g, 'pattern.png');


  g = createGraphics(1440, 2560);
  g.background(panel.getColor());
  renderExportGrid(g);
  save(g, 'pattern_vertical.png');

  g = createGraphics(t.w, t.h);
  g.background(panel.getColor());
  renderExportTile(g);
  save(g, 'tile.png');


}

function gotFile(file) {
  load_img = null;
  if (file.type === 'image') {
    for(let i = 0 ; i < thumbs.length ; i ++){
      if(thumbs[i].isInside(mouseX, mouseY)){
        load_img = loadImage(file.data);
        thumb_index_change = i;
        waiting_for_image = true;
        break;
      }
    }

  }else {
    console.log('Not an image file!');
  }
}

function windowResized() {

}

function showUi(){
  render_ui = true;
  last_action = millis();
}

function hideUi(){
  if(render_ui)
  render_ui = false;
}
