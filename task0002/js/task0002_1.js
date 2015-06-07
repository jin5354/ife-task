window.onload = function(){

    var $btn1 = $('#task1-btn');
    var $input1 = $('#task1-input');
    var $p1 = $('#task1-result');

    $.click($btn1, function(e){

        var arr = uniqArray(trim($input1.value).split(';'));
        var ret = [];
        each(arr, function(e){
            if(trim(e)){ret.push(e);}
        });

        text($p1, ret.join(' '));
    });


    var $btn2 = $('#task2-btn');
    var $input2 = $('#task2-input');
    var $p2 = $('#task2-result');

    $.click($btn2, function(e){

        var arr = uniqArray(trim($input2.value).split(/[;\s,，、\n]/g));
        var ret = [];
        each(arr, function(e){
            if(trim(e)){ret.push(e);}
        });

        text($p2, ret.join(' '));
    });

    var $btn3 = $('#task3-btn');
    var $input3 = $('#task3-input');
    var $p3 = $('#task3-p');
    var $div3 = $('#task3-div');

    $.click($btn3, function(e){

        var arr = uniqArray(trim($input3.value).split(/[;\s,，、\n]/g));
        var ret = [];
        each(arr, function(e){
            if(trim(e)){ret.push(e);}
        });
        if(ret.length == 0){
            text($p3, '不能啥都不输入！');
        }else if(ret.length > 10){
            text($p3, '输入不能超过10个！');
        }else{
            var docFrag = document.createDocumentFragment();    
            for(var i=0,len=ret.length;i<len;i++){
                var label = document.createElement('label');
                label.setAttribute('for', 'int'+(i+1));
                text(label, ret[i]);
                docFrag.appendChild(label);
                var checkbox = document.createElement('input');
                checkbox.id = 'int'+(i+1);
                checkbox.setAttribute('type', 'checkbox');
                docFrag.appendChild(checkbox);
            }

            $div3.appendChild(docFrag);
        }
    });

}