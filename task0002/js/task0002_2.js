window.onload = function(){

    var $input = $('#date-input');
    var $btn = $('#btn');
    var $year = $('#year');
    var $month = $('#month');
    var $day = $('#day');
    var $days = $('#days');
    var $hours = $('#hours');
    var $minutes = $('#minutes');
    var $seconds = $('#seconds');

    $.click($btn, function(e){
        var inputDate = trim($input.value);
        if(inputDate.search(/\d{4}-\d{2}-\d{2}/g) === -1){
            alert('请按照YYYY-MM-DD格式填写！');
        }else{
            var year = inputDate.match(/\d+/g)[0];
            var month = inputDate.match(/\d+/g)[1];
            var day = inputDate.match(/\d+/g)[2];

            if(month < 1 || month >12){
                alert('月份应在1-12之间！');
            }else if(day < 1 || day > 31 ){
                alert('日期应在1-31之间！');
            }else{

                var future = new Date(inputDate);
                text($year,year);
                text($month,month);
                text($day,day);
                showTime(future);
                setInterval(function(){
                    showTime(future);
                }, 1000);
            }
        }

    });

    function showTime(future){
        var cur = new Date();
        var diff = future - cur;

        var days = diff/(24*60*60*1000) >= 1?Math.floor(diff/(24*60*60*1000)):0;
        diff = diff % (24*60*60*1000);
        var hours = diff/(60*60*1000) >= 1?Math.floor(diff/(60*60*1000)):0;
        diff = diff % (60*60*1000);
        var minutes = diff/(60*1000) >= 1?Math.floor(diff/(60*1000)):0;
        diff = diff % (60*1000);
        var seconds = diff/1000 >= 1?Math.floor(diff/1000):0;

        text($days,days);
        text($hours,hours);
        text($minutes,minutes);
        text($seconds,seconds);
    }
}