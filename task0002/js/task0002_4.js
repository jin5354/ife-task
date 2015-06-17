window.onload = function(){

    var $search = $('#search');
    var $sug = $('#sug');

    addEvent($search, 'keyup', function(e){

        var txt = trim($search.value);

        if(txt){
            ajax('http://localhost:3000/ajax?txt='+txt, {
                type:'get',
                onsuccess: function(xhr){
                    var data = JSON.parse(xhr.responseText);
                    $sug.innerHTML='';
                    removeClass($sug, 'active');
                        if(data.arr.length > 0){
                            addClass($sug, 'active');
                        var f = document.createDocumentFragment();
                        for(var i = 0;i<data.arr.length;i++){
                            var li = document.createElement('li');
                            text(li, trim($search.value));
                            var span = document.createElement('span');
                            text(span, data.arr[i]);
                            addClass(span, 'em');
                            li.appendChild(span);
                            (function(li,i){
                                addEvent(li, 'mouseenter', function(){
                                    addClass(li, 'li_focus');
                                });
                                addEvent(li, 'mouseleave', function(){
                                    removeClass(li, 'li_focus');
                                });
                                addClickEvent(li, function(e){
                                    $search.value += data.arr[i];
                                    $sug.innerHTML='';
                                    removeClass($sug, 'active');
                                });
                            })(li,i);
                            f.appendChild(li);
                        }
                        $sug.appendChild(f);
                    }
                }
            });
        }

    });
}