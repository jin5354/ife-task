window.onload = function(){

    var cates = [{title: "百度IFE项目",cateChilds:[{title:'task-1', tasks:[]},{title:'task-2', tasks:[]}],deletable: true},{title: "默认分类",cateChilds:[],deletable: false}];
    var catesWrapper = $('.cates-wrapper');
    var tasksWrapper = $('.tasks-wrapper');

    function Task(title, date, content, done){
        this.title = title;
        this.date = date;
        this.content = content;
        this.ID = IDgen('task');
        this.done = done;
    }

    cates[0].cateChilds[0].tasks.push(new Task('to-do-1', '2015-04-28', 'testtesttest1', false));
    cates[0].cateChilds[0].tasks.push(new Task('to-do-2', '2015-04-28', 'testtesttest2', true));
    cates[0].cateChilds[0].tasks.push(new Task('to-do-3', '2015-04-29', 'testtesttest3', false));
    cates[0].cateChilds[0].tasks.push(new Task('to-do-4', '2015-04-29', 'testtesttest4', false));
    cates[0].cateChilds[1].tasks.push(new Task('to-do-6', '2015-05-29', 'testtesttest5', false));
    cates[0].cateChilds[1].tasks.push(new Task('to-do-9', '2016-05-21', 'testtesttest6', false));

    renderCates($('.cates-wrapper'));

    function Cate(title){
        this.title = title;
        this.cateChilds = [];
    }

    function ChildCate(parent, title){
        this.title = title;
        this.tasks = [];
    }

    function renderCates(wrapper){
        var cateStr = '';
        for(var i=0, clen=cates.length;i<clen;i++){
            var cateChildsStr = ''
            for(var j=0,tlen=cates[i].cateChilds.length;j<tlen;j++){
                cateChildsStr += '<p class="cate cate-child" data-childCate="' + cates[i].cateChilds[j].title + '" data-cateParent="' + cates[i].title + '"><span class="task-ico icon"></span>' + cates[i].cateChilds[j].title + '(<span class="childcate-num">' + getCateNum(getChildCateByTitle(cates[i].cateChilds[j].title, cates[i].title)) + '</span>)</p>';
            }
            cateStr+='<div class="cate-folder"><p class="cate-folder-title" data-cate="' + cates[i].title + '"><span class="folder-ico icon"></span>' + cates[i].title + '(<span class="cate-num">' + getCateNum(getCateByTitle(cates[i].title)) + '</span>)</p><div class="cate-folder-content">' + cateChildsStr + '</div></div>';
        }

        wrapper.innerHTML = cateStr;
        var all_num = $(".all-num");
        text(all_num, getAllNum());
    }

    

    //点击分类列表
    $.delegate(catesWrapper, 'p', 'click', function(event) {
        var cateObj;
        if(event.target.getAttribute('data-cate')) {
            cateObj = getCateByTitle(event.target.getAttribute('data-cate'));
            tasksWrapper.setAttribute("isChild","0");
            tasksWrapper.setAttribute("cate",event.target.getAttribute('data-cate'));
            tasksWrapper.removeAttribute("parent");
            renderTasks(cateObj, tasksWrapper, 'all', false);
        }else if(event.target.getAttribute('data-childcate')){
            cateObj = getChildCateByTitle(event.target.getAttribute('data-childcate'), event.target.getAttribute('data-cateparent'));
            tasksWrapper.setAttribute("isChild","1");
            tasksWrapper.setAttribute("cate",event.target.getAttribute('data-childcate'));
            tasksWrapper.setAttribute("parent",event.target.getAttribute('data-cateparent'));
            renderTasks(cateObj, tasksWrapper, 'all', true);
        }
        each(Array.prototype.slice.call(catesWrapper.getElementsByTagName('p')),function(elem){
            removeClass(elem, 'active');
        });
        addClass(event.target, 'active');
        each(Array.prototype.slice.call(taskNav.getElementsByTagName('li')),function(elem){
            removeClass(elem, 'active');
        });
        addClass($('.nav .all'), 'active');
    });

    //点击任务列表
    $.delegate(tasksWrapper, 'p', 'click', function(event) {
        var taskObj;
        if(event.target.getAttribute('task-id')){
            taskObj = getTaskById(event.target.getAttribute('task-id'));
            renderDetail(taskObj,event.target.getAttribute('task-id'));
        }
        if(hasClass(event.target,'task')){
            each(Array.prototype.slice.call(tasksWrapper.getElementsByTagName('p')),function(elem){
                removeClass(elem, 'active');
            });
            addClass(event.target, 'active');
        }
        
    });

    var taskNav = $(".nav");

    //点击任务导航条，所有-完成-未完成
    $.delegate(taskNav, 'li', 'click', function(event) {

        each(Array.prototype.slice.call(taskNav.getElementsByTagName('li')),function(elem){
            removeClass(elem, 'active');
        });
        addClass(event.target, 'active');

        if(tasksWrapper.hasAttribute("cate")){
            if(hasClass(event.target, 'all')){
                if(+tasksWrapper.getAttribute("isChild")){
                    renderTasks(getChildCateByTitle(tasksWrapper.getAttribute("cate"),tasksWrapper.getAttribute("parent")), tasksWrapper, 'all', true);
                }else{
                    renderTasks(getCateByTitle(tasksWrapper.getAttribute("cate")) ,tasksWrapper, 'all', false);
                }
            }else if(hasClass(event.target, 'unfinished')){
                if(+tasksWrapper.getAttribute("isChild")){
                    renderTasks(getChildCateByTitle(tasksWrapper.getAttribute("cate"),tasksWrapper.getAttribute("parent")), tasksWrapper, 'unfinished', true);
                }else{
                    renderTasks(getCateByTitle(tasksWrapper.getAttribute("cate")) ,tasksWrapper, 'unfinished', false);
                }
            }else if(hasClass(event.target, 'finished')){
                if(+tasksWrapper.getAttribute("isChild")){
                    renderTasks(getChildCateByTitle(tasksWrapper.getAttribute("cate"),tasksWrapper.getAttribute("parent")), tasksWrapper, 'finished', true);
                }else{
                    renderTasks(getCateByTitle(tasksWrapper.getAttribute("cate")) ,tasksWrapper, 'finished', false);
                }
            }
        }
    });

    function renderTasks(cateObj, wrapper, status, isChild){
        var tasksStr = '';
        var dateArr = [];
        if(isChild){
            //针对子分类列表
            for(var i=0,len=cateObj.tasks.length;i<len;i++){
                if(!dateArr.some(function(e,index,a){return e === cateObj.tasks[i].date})){
                    dateArr.push(cateObj.tasks[i].date);
                }
            }
            dateArr = dateArr.sort(function(a,b){
                return new Date(a) > new Date(b);
            });

            for(var i=0,dlen=dateArr.length;i<dlen;i++){
                var aDayTasksStr = '';
                if(status==="all"){
                    for(var j=0,len=cateObj.tasks.length;j<len;j++){
                        if(cateObj.tasks[j].date === dateArr[i]){
                            if(cateObj.tasks[j].done === true){
                                aDayTasksStr += '<p class="task date-child finished" task-id="' + cateObj.tasks[j].ID + '">' + cateObj.tasks[j].title + '</p>';
                            }else{
                                aDayTasksStr += '<p class="task date-child" task-id="' + cateObj.tasks[j].ID + '">' + cateObj.tasks[j].title + '</p>';
                            }
                        }
                    }
                }else if(status==="finished"){
                    for(var j=0,len=cateObj.tasks.length;j<len;j++){
                        if(cateObj.tasks[j].date === dateArr[i] && cateObj.tasks[j].done === true){
                            aDayTasksStr += '<p class="task date-child finished" task-id="' + cateObj.tasks[j].ID + '">' + cateObj.tasks[j].title + '</p>';
                        }
                    }
                }else if(status==="unfinished"){
                    for(var j=0,len=cateObj.tasks.length;j<len;j++){
                        if(cateObj.tasks[j].date === dateArr[i] && cateObj.tasks[j].done === false){
                            aDayTasksStr += '<p class="task date-child" task-id="' + cateObj.tasks[j].ID + '">' + cateObj.tasks[j].title + '</p>';
                        }
                    }
                }
                
                if(aDayTasksStr !== ""){
                    tasksStr += '<div class="task-date"><p class="date">' + dateArr[i] + '</p><div class="task-date-content">' + aDayTasksStr + '</div></div>';
                }
            }
            wrapper.innerHTML = tasksStr;
        }else{
            //针对父分类列表
            for(var i=0,len=cateObj.cateChilds.length;i<len;i++){
                for(var j=0,tlen=cateObj.cateChilds[i].tasks.length;j<tlen;j++){
                    if(!dateArr.some(function(e,index,a){return e === cateObj.cateChilds[i].tasks[j].date})){
                        dateArr.push(cateObj.cateChilds[i].tasks[j].date);
                    }
                }
            }

            dateArr = dateArr.sort(function(a,b){
                return new Date(a) > new Date(b);
            });

            for(var i=0,dlen=dateArr.length;i<dlen;i++){
                var aDayTasksStr = '';
                if(status==="all"){
                    for(var j=0,len=cateObj.cateChilds.length;j<len;j++){
                        for(var k=0,tlen=cateObj.cateChilds[j].tasks.length;k<tlen;k++){
                            if(cateObj.cateChilds[j].tasks[k].date === dateArr[i]){
                                if(cateObj.cateChilds[j].tasks[k].done === true){
                                    aDayTasksStr += '<p class="task date-child finished" task-id="' + cateObj.cateChilds[j].tasks[k].ID + '">' + cateObj.cateChilds[j].tasks[k].title + '</p>';
                                }else{
                                    aDayTasksStr += '<p class="task date-child" task-id="' + cateObj.cateChilds[j].tasks[k].ID + '">' + cateObj.cateChilds[j].tasks[k].title + '</p>';
                                }
                            }
                        }
                    }
                }else if(status==="finished"){
                    for(var j=0,len=cateObj.cateChilds.length;j<len;j++){
                        for(var k=0,tlen=cateObj.cateChilds[j].tasks.length;k<tlen;k++){
                            if(cateObj.cateChilds[j].tasks[k].date === dateArr[i] && cateObj.cateChilds[j].tasks[k].done === true){
                                aDayTasksStr += '<p class="task date-child finished" task-id="' + cateObj.cateChilds[j].tasks[k].ID + '">' + cateObj.cateChilds[j].tasks[k].title + '</p>';
                            }
                        }
                    }
                }else if(status==="unfinished"){
                    for(var j=0,len=cateObj.cateChilds.length;j<len;j++){
                        for(var k=0,tlen=cateObj.cateChilds[j].tasks.length;k<tlen;k++){
                            if(cateObj.cateChilds[j].tasks[k].date === dateArr[i] && cateObj.cateChilds[j].tasks[k].done === false){
                                aDayTasksStr += '<p class="task date-child" task-id="' + cateObj.cateChilds[j].tasks[k].ID + '">' + cateObj.cateChilds[j].tasks[k].title + '</p>';
                            }
                        }
                    }
                }
                
                if(aDayTasksStr !== ""){
                    tasksStr += '<div class="task-date"><p class="date">' + dateArr[i] + '</p><div class="task-date-content">' + aDayTasksStr + '</div></div>';
                }
            }
            wrapper.innerHTML = tasksStr;
        }
    }

    function renderDetail(task,id){

        var task_title = $(".task-title-text");
        var task_date = $(".task-date-text");
        var task_detail = $(".detail-text");

        text(task_title, task.title);
        text(task_date, task.date);
        text(task_detail, task.content);

        var details = $(".details");
        details.setAttribute("taskID", id);

        $('.task-title-text').style.display = 'inline';
        $('.task-date-text').style.display = 'inline';
        $('.detail-text').style.display = 'block';

        $(".task-title-input").style.display = 'none';
        $(".task-date-input").style.display = 'none';
        $(".textarea-wrap").style.display = 'none';

    }

    var editBtn = $(".edit-ico");
    var finishBtn = $(".finish-ico");
    var cancelBtn = $(".cancel");
    var saveBtn = $(".save");

    //编辑
    $.click(editBtn, function(){

        if($(".details").hasAttribute("taskid")){
            $('.task-title-text').style.display = 'none';
            $('.task-date-text').style.display = 'none';
            $('.detail-text').style.display = 'none';

            $(".task-title-input").style.display = 'inline-block';
            $(".task-date-input").style.display = 'inline-block';
            $(".textarea-wrap").style.display = 'block';

            $(".task-title-input").value = text($('.task-title-text'));
            $(".task-date-input").value = text($('.task-date-text'));
            $(".textarea-wrap textarea").value = text($('.detail-text'));
        }
    });

    //取消编辑
    $.click(cancelBtn, function(){
        $('.task-title-text').style.display = 'inline';
        $('.task-date-text').style.display = 'inline';
        $('.detail-text').style.display = 'block';

        $(".task-title-input").style.display = 'none';
        $(".task-date-input").style.display = 'none';
        $(".textarea-wrap").style.display = 'none';
    });

    //保存编辑
    $.click(saveBtn, function(){

        var task = getTaskById($(".details").getAttribute("taskid"));
        task.title = $(".task-title-input").value;
        task.date = $(".task-date-input").value;
        task.content = $(".textarea-wrap textarea").value;

        renderDetail(task ,$(".details").getAttribute("taskid"));
    });

    //完成任务
    $.click(finishBtn, function(){
        if($(".details").hasAttribute("taskid")){
            var task = getTaskById($(".details").getAttribute("taskid"));
            task.done = true;
            updateNum();
        }
    });

    //获取某个分类列表的未完成任务数量
    function getCateNum(cateObj){

        var count = 0;  
        if(typeof cateObj.cateChilds !== "undefined"){
            //父分类列表
            for(var j=0,len=cateObj.cateChilds.length;j<len;j++){
                for(var k=0,tlen=cateObj.cateChilds[j].tasks.length;k<tlen;k++){
                    if(cateObj.cateChilds[j].tasks[k].done === false){
                        count++;
                    }
                }
            }
        }else{
            //子分类列表
            for(var j=0,len=cateObj.tasks.length;j<len;j++){
                if(cateObj.tasks[j].done === false){
                    count++;
                }
            }
        }
        return count;
    }

    //获取全部未完成任务数量
    function getAllNum(){

        var count = 0;
        for(var i=0,len=cates.length;i<len;i++){
            for(var j=0,len=cates[i].cateChilds.length;j<len;j++){
                for(var k=0,tlen=cates[i].cateChilds[j].tasks.length;k<tlen;k++){
                    if(cates[i].cateChilds[j].tasks[k].done === false){
                        count++;
                    }
                }
            }
        }

        return count;
    }

    //更新全部数量
    function updateNum(){
        text($(".all-num"), getAllNum());
        for(var i=0,len=cates.length;i<len;i++){
            for(var j=0,len=cates[i].cateChilds.length;j<len;j++){
                text($("[data-childcate=" + cates[i].cateChilds[j].title + "] .childcate-num"), getCateNum(cates[i].cateChilds[j]));
            }
            console.log($("[data-cate=" + cates[i].title + "] .cate-num"));
            text($("[data-cate=" + cates[i].title + "] .cate-num"), getCateNum(cates[i]));
        }
    }

    //更新任务列表页状态
    function updateTaskActive(){
        
    }

    //获取父分类列表
    function getCateByTitle(title){
        for(var i=0,len=cates.length;i<len;i++){
            if(cates[i].title === title){
                return cates[i];
            }
        }
    }

    //console.log(getCateByTitle("百度IFE项目"));
    //获取子分类列表
    function getChildCateByTitle(title, parentTitle){
        for(var i=0,len=cates.length;i<len;i++){
            if(cates[i].title === parentTitle){
                for(var j=0,clen=cates[i].cateChilds.length;j<clen;j++){
                    if(cates[i].cateChilds[j].title === title){
                        return cates[i].cateChilds[j];
                    }
                }
            }
        }
    }

    //获取任务
    function getTaskById(taskID){
        for(var i=0,len=cates.length;i<len;i++){
            for(var j=0,clen=cates[i].cateChilds.length;j<clen;j++){
                for(var k=0,tlen=cates[i].cateChilds[j].tasks.length;k<tlen;k++){
                    if(cates[i].cateChilds[j].tasks[k].ID === taskID){
                        return cates[i].cateChilds[j].tasks[k];
                    }
                }
            }
        }
    }

    function IDgen(prefix){
        return prefix + Math.floor(Math.random().toFixed(10)*1e10+Date.now()/1e3);
    }

}