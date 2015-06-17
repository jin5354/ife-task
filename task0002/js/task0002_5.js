window.onload = function(){
    var $body = $('body');
    var $wrap = $('.wrap');

    var $left = $('#left');
    var $right = $('#right');

    var leftLis = [];
    var rightLis = [];

    function lisPush(){
        leftLis = [];
        rightLis = [];
        each(Array.prototype.slice.call($left.childNodes[1].childNodes), function(item, index){
            if(item.nodeType === 1){
                leftLis.push(item);
            }
        });
        each(Array.prototype.slice.call($right.childNodes[1].childNodes), function(item, index){
            if(item.nodeType === 1){
                rightLis.push(item);
            }
        });
    }
    
    $.delegate($wrap, 'li', 'mousedown',function(e){

        console.log('click!');

        var origin = e.target;

        var originX = getPosition(origin).left;
        var originY = getPosition(origin).top;
        var originArea = originX === 50?0:1;

        var temp = origin.cloneNode(true);

        addClass(origin, 'moving');

        temp.setAttribute('id','moving-li');
        temp.style.left = originX + 'px';
        temp.style.top = originY + 'px';

        $body.appendChild(temp);

        var startX = e.clientX;
        var startY = e.clientY;

        var areaA_X = getPosition($left).left;
        var areaA_Y = getPosition($left).top;
        var areaB_X = getPosition($right).left;
        var areaB_Y = getPosition($right).top;

        $.on(document, 'mousemove', moveTemp);

        $.on(document, 'mouseup', function(e) {

            console.log('mouseup!');

            var tempCenterX = parseInt(temp.style.left) + 51;
            var tempCenterY = parseInt(temp.style.top) + 20;

            console.log(tempCenterX,tempCenterY);

            $body.removeChild(temp);

            if((tempCenterX > 152 && tempCenterX < 298) || tempCenterX > 400 || tempCenterY < 30 || tempCenterY > 450){
                removeClass($('.moving'), 'moving');
            }else if(tempCenterX < 152){
                if(!originArea){
                    $left.childNodes[1].removeChild(origin);
                }else{
                    $right.childNodes[1].removeChild(origin);
                }
                lisPush();
                var res = origin.cloneNode(true);
                removeClass(res, 'moving');
                var insertIndex = Math.floor((tempCenterY-30)/40);
                if(leftLis[insertIndex]){
                    $left.childNodes[1].insertBefore(res, leftLis[insertIndex]);
                }else{
                    $left.childNodes[1].appendChild(res);
                }
            }else{
                if(!originArea){
                    $left.childNodes[1].removeChild(origin);
                }else{
                    $right.childNodes[1].removeChild(origin);
                }
                lisPush();
                var res = origin.cloneNode(true);
                removeClass(res, 'moving');
                var insertIndex = Math.floor((tempCenterY-30)/40);
                if(rightLis[insertIndex]){
                    $right.childNodes[1].insertBefore(res, rightLis[insertIndex]);
                }else{
                    $right.childNodes[1].appendChild(res);
                }
            }

            temp = null;
            origin = null;
            res = null;

            $.un(document, 'mousemove', moveTemp);
            $.un(document, 'mouseup', arguments.callee);
        });

        function moveTemp(e){

            var curX = e.clientX;
            var curY = e.clientY;

            temp.style.left = originX + (curX-startX) +'px';
            temp.style.top = originY + (curY-startY) +'px';
        }

    });
    
}