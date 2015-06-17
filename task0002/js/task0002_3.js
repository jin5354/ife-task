window.onload = function(){

    /*
        options:
        {
            sequence: forward(default) / reverse,
            loop: true / false(default),
            waitTime: 1000(default)
            animationDelay: 500(default),
        }
    
    */

    function Slider(element ,options){
        this.init(element, options);
    }

    Slider.prototype = {
        init: function(element, options){
            this.imgBox = $('#wrapper');
            this.pageBox = $('#pagination');
            this.curPage = 0;
            this.pages = [];
            this.width = $(element).offsetWidth;
            this.height = $(element).offsetHeight;

            for(var i = 0,len = this.imgBox.childNodes[1].childNodes.length;i<len;i++){
                if(this.imgBox.childNodes[1].childNodes[i].nodeType === 1){
                    this.pages.push(this.imgBox.childNodes[1].childNodes[i]);
                }
            }

            this.pageNum = this.pages.length;

            var opt = options || {};
            this.animationDelay = opt.animationDelay || 500;
            this.sequence = opt.sequence || 'forward';
            this.isReverse = this.sequence === 'forward'?false:true;
            this.loop = opt.loop || false;
            this.waitTime = opt.waitTime || 2000;

            this.createBtns();
            this.btns = this.pageBox.firstChild.childNodes;
            this.animating = false;

            //console.log(this.pages);
            //console.log(this.btns);

            addClass(this.btns[0],'active');
            addClass(this.pages[0],'active');

            this.autoPlay();

        },
        createBtns: function(){
            var ul = document.createElement('ul');
            var that = this;
            for(var i = 0,len = this.pageNum;i<len;i++){
                var li = document.createElement('li');
                text(li,i);
                (function(num){
                    addClickEvent(li,function(){
                        that.turn(that.curPage, num,that.animationDelay,num>that.curPage);
                    });
                })(i);
                
                ul.appendChild(li);
            }
            this.pageBox.appendChild(ul);
        },
        turn: function(last,next,delayTime,seq){
            if(this.animating){return false;}
            console.log(last,next,delayTime,seq);
            if(last === next){return false;}
            this.animating = true;
            var offset = this.width;
            var offset2 = 0;
            var _width = this.width;
            var start = null;
            var start2 = null;
            var end,end2;
            this.curPage = next;

            var that = this;

            console.log(this.curPage);

            addClass(this.pages[next], 'active');
            addClass(this.btns[next], 'active');
            removeClass(this.btns[last],'active');

            if(seq) {
                this.pages[next].style.left = this.width + 'px';
                this.pages[last].style.left = '0px';
                var turnIn = setInterval(function(){
                    if(!start){start = new Date();}
                    var pastTime = new Date();
                    var progress = (pastTime-start)/delayTime;
                    that.pages[next].style.left = _width*(1-(progress>1?1:progress)) +'px'; 
                    if(progress>1){clearInterval(turnIn);that.animating=false;}
                },1000/60);
                var turnOut = setInterval(function(){
                    if(!start2){start2 = new Date();}
                    var pastTime = new Date();
                    var progress = (pastTime-start2)/delayTime;
                    that.pages[last].style.left = -_width*(progress>1?1:progress) +'px'; 
                    if(progress>1){
                        clearInterval(turnOut);
                        removeClass(that.pages[last],'active');
                        that.animating=false;
                    }
                },1000/60);
            }else{
                this.pages[next].style.left = -this.width + 'px';
                this.pages[last].style.left = '0px';
                var turnIn = setInterval(function(){
                    if(!start){start = new Date();}
                    var pastTime = new Date();
                    var progress = (pastTime-start)/delayTime;
                    that.pages[next].style.left = -_width*(1-(progress>1?1:progress)) +'px'; 
                    if(progress>1){clearInterval(turnIn);that.animating=false;}
                },1000/60);
                var turnOut = setInterval(function(){
                    if(!start2){start2 = new Date();}
                    var pastTime = new Date();
                    var progress = (pastTime-start2)/delayTime;
                    that.pages[last].style.left = _width*(progress>1?1:progress) +'px'; 
                    if(progress>1){
                        clearInterval(turnOut);
                        removeClass(that.pages[last],'active');
                        that.animating=false;
                    }
                },1000/60);
            }
            
        },
        autoPlay: function(){
            console.log('autoplay on.');
            var that = this;
            if(!this.isReverse){
                var auto = setInterval(function(){
                    if(that.loop){
                        that.turn(that.curPage,(that.curPage+1)===that.pageNum?0:(that.curPage+1),that.animationDelay,true);
                    }else{
                        if(that.curPage+1 === that.pageNum){clearInterval(auto);return false;}
                        that.turn(that.curPage,that.curPage+1,that.animationDelay,true);
                    }
                },this.waitTime+this.animationDelay);
            }else{
                var auto = setInterval(function(){
                    if(that.loop){
                        that.turn(that.curPage,that.curPage===0?(that.pageNum-1):(that.curPage-1),that.animationDelay,false);
                    }else{
                        if(that.curPage-1 < 0){clearInterval(auto);return false;}
                        that.turn(that.curPage,that.pageNum-1,that.animationDelay,false);
                    }
                },this.waitTime+this.animationDelay);
            }
        }
    }

    var sliderTest = new Slider('#slider',{
        sequence: 'forward',
        loop: true,
        waitTime: 3000,
        animationDelay: 1000
    });

}