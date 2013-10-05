
var _activeWindows = {};

var WindowAssistant = function(option){
  this.x = option.x || 10;
  this.y = option.y || 10;
  this.fixed = option.fixed || false;
  this.title = option.title || "";
  if(option.closeButton == false){
    this.closeButtonExist = false;
  }
  else{
    this.closeButtonExist = true;
  }

  this.id = this.get_identifier();
  this.onCloseWindow = this.doNothing;
  this.onMoveEndWindow = this.doNothing;
  this.onMoveStartWindow = this.doNothing;

  _activeWindows[this.id] = this;

  this.window_frame = this.createWindowFrame();
  
  this.title_bar = this.createTitleBar(this.title);
  this.window_frame.appendChild(this.title_bar);
  this.content_area = this.createContentArea();
  this.window_frame.appendChild(this.content_area);

  if(this.closeButtonExist){
    this.close_button = this.createCloseButton();
    this.title_bar.appendChild(this.close_button);
    //クリックされたら自分を削除するイベント追加
    var that = this;
    this.close_button.addEventListener("click",function(){
      //消していいのか確認する時は確認する
      if(that.onCloseWindow()){
        delete _activeWindows[that.id];
        document.body.removeChild(that.window_frame);
        delete that;
      }
    });
  }

/*
  this.window_frame.style.backgroundColor = "RGB(255,0,0)";
  this.window_frame.style.width = 80+"px";
  this.window_frame.style.height = 400+"px";
*/

  document.body.appendChild(this.window_frame);
}
WindowAssistant.prototype.createWindowFrame = function(){
  var window_frame = document.createElement("div");
  window_frame.id = this.id;
  window_frame.className = "window_frame";
  window_frame.style.top = this.y + "px";
  window_frame.style.left = this.x + "px";
  if(this.fixed){
    window_frame.style.position = "fixed";
  }
/* ////スタイルシートはwindowAssistantStyle.cssで指定
  this.window_frame.style.position = "absolute";
  //...etc
*/
  return window_frame;
}
WindowAssistant.prototype.createTitleBar = function(title){
  var title_bar = document.createElement("div");
  title_bar.className = "title_bar";
  title_bar.innerHTML = title;
  title_bar.dataset.fixed = this.fixed;
/* //スタイルシートはwindowAssistantStyle.cssで指定
  this.title_bar.style.width = "100%";
  this.title_bar.style.height = "25px";
  //...etc
*/

  return title_bar;
}
WindowAssistant.prototype.createContentArea = function(){
  var content_area = document.createElement("div");
  content_area.className = "content_area";

  return content_area;
}
WindowAssistant.prototype.createCloseButton = function(){
  var close_button = document.createElement("div");
  close_button.className = "close_button";
  close_button.innerHTML = "☓";

  //winとMacでわける処理
  close_button.style.cssFloat = "left";

  return close_button
}
WindowAssistant.prototype.get_identifier = function(){
  if(typeof(arguments.callee._identifier) == "undefined"){
    arguments.callee._identifier = 0;
  }
  if(typeof(arguments.callee._identifier) != "undefined"){
    arguments.callee._identifier++;
  }

  return "wdwastnt-window-"+arguments.callee._identifier;
}
WindowAssistant.prototype.get_zIndex = function(){
  if(typeof(arguments.callee.a) == "undefined"){
    arguments.callee.a = 0;
  }
  if(typeof(arguments.callee.a) != "undefined"){
    arguments.callee.a++;
  }

  return arguments.callee.a;
}
WindowAssistant.prototype.doNothing = function(){
  //DOOOOOO NOOOOOOOTTHIIIIIIIINGGGGGGGGGG!!!!
}

//draggableにしてる。
window.addEventListener("load",function(){
  var dragging = false;
  var draggingElement;
  var offsetX,offsetY;

  var zIndex = 0;
  document.body.addEventListener("mousedown",function(e){
    if(e.target.className == "title_bar"){
      e.preventDefault();
      dragging = true;
      draggingElement = e.target.parentElement;
      var scrollPosition = getScrollPosition();
      var frame_rects = draggingElement.getClientRects();
      offsetX = e.pageX - frame_rects[0].left - scrollPosition.x;
      offsetY = e.pageY - frame_rects[0].top  - scrollPosition.y;

      if(e.target.dataset.fixed == "true"){
        offsetX += scrollPosition.x;
        offsetY += scrollPosition.y;
      }

      draggingElement.style.zIndex = ++zIndex;
      _activeWindows[draggingElement.id].onMoveStartWindow();      
    }
  },true);
  document.body.addEventListener("mousemove",function(e){
    if(!dragging){
      return ;
    }
    draggingElement.style.left = e.pageX - offsetX+"px";
    draggingElement.style.top = e.pageY - offsetY + "px";
    
  },true);
  document.body.addEventListener("mouseup",function(){
    if(dragging){
      dragging = false;
      _activeWindows[draggingElement.id].onMoveEndWindow();
    }
  });
  function getScrollPosition(){
    return  {
      "x":document.documentElement.scrollLeft || document.body.scrollLeft,
      "y":document.documentElement.scrollTop || document.body.scrollTop
    };
  }

},true);

