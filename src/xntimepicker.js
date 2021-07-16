//! XNTimepicker.js
//! version : 1.0.0
//! authors : 范媛媛
//! create date:2021/01/01
//! update date:2021/01/05
import './xnquery.js';
import dayjs from './dayjs/esm/index.js';
(function (window, $) {
    var option = {

    }

    function XNTimepicker(targetDom, options) {
        this.$targetDom=$(targetDom.get(0));
        this.option = $.extend({}, option, options);

        this.id=this.getRandomString();
        this.show=false;
        this.eventList={};
        this.init();
        this.addPosEvent();
        this.addTargetEvent();
    }

    XNTimepicker.prototype = {
        init() {
            this.rendtime();
            this.setPosition();
            this.addEvent();
            this.initCallback();
            this.initCurTime()
            // this.rendHoverStyle();
        },
        updateCurrentTime(time){
            var hour=dayjs(time).format('HH');
            var minute=dayjs(time).format('mm');
            var second=dayjs(time).format('ss');
            var time1=hour+':'+minute+':'+second;
            this.trigger("confirm",{str:time1,value:{hour:hour,minute:minute,second:second}})
        },
        initCurTime(){
            this.updateCurrentTime(this.option.time)
        },
        initCallback(){
            this.on('confirm',this.option.onConfirm);
        },
        addTargetEvent(){
            document.addEventListener('click',(e)=>{
                if(e.target==this.$targetDom.get(0) || (this.$targetDom.find(e.target).get(0) && !$(e.target).parents('.xntimepicker').get(0))){
                    this.changeShowStatus();
                }
                else if(!$(e.target).parents('.xntimepicker').get(0) || ($(e.target).parents('.xntimepicker').get(0).id!=this.id)){

                    this.changeShowStatus(true);
                }
            },true)//捕获阶段

        },
        changeShowStatus(hide){
            if(this.show || hide){
                this.show=true;
                this.$container.hide();
            }
            else{
                this.$container.show();
                this.setPosition();
            }
            this.show=!this.show;
        },
        addPosEvent:function(){
            var that=this;
            window.addEventListener("scroll",function(){
                that.setPosition();
            })
            window.addEventListener("resize",function(){
                that.setPosition();
            })
        },
        setPosition:function(){
            if(!this.$container.get(0)){
                return;
            }
            var wwidth=document.documentElement.clientWidth;
            var wheight=document.documentElement.clientHeight;
            var curcolordom=this.$targetDom.get(0)
            var targetTop=curcolordom.getBoundingClientRect().top;
            var top=targetTop;
            var targetLeft=curcolordom.getBoundingClientRect().left;
            var left=targetLeft;
            var targetWidth=this.$targetDom.outerWidth();
            var targetHeight=this.$targetDom.outerHeight();
            var domwidth=this.$container.outerWidth();
            var domheight=this.$container.outerHeight();
            var top=top+targetHeight+8;
            if(left+domwidth>wwidth){
                left=targetWidth+targetLeft-domwidth;
            }
            // else{
            //     left=left+10+curcolordom.offsetWidth;
            // }
            // if(wheight-top<domheight){
            //     top=top-domheight-curcolordom.offsetHeight;
            // }
            // else{
            //     top=top
            // }
            // if(top<10){
            //     top=10
            // }
            // if(left<0){
            //     top=top+targetHeight+10;
            //     left=targetLeft+targetWidth-domwidth;
            // }
            this.$container.get(0).style.top=top+"px";
            this.$container.get(0).style.left=left+"px";
        },
        rendtime() {
            if (!this.option.format) {
                this.option.format = 'HH:mm:ss'
            }
            var html = `
          <div class="xntimepicker" id="${this.id}">`
            var hours = '<ul class="hours">', minutes = '<ul class="minutes">', seconds = '<ul class="seconds">';
            var hourlist = [], minutelist = [], secondlist = []
            for (let i = 0; i < 60; i++) {
                let n = (i < 10 ? ('0' + i) : i);
                if (i < 24) {
                    hours += '<li data-i="' + n + '">' + n + '时</li>'
                }
                minutes += '<li data-i="' + n + '">' + n + '分</li>'
                seconds += '<li data-i="' + n + '">' + n + '秒</li>'
            }
            var option = `
        <div><div class="time-cont">`
            option += hours + '</ul>';
            if (this.option.format.indexOf('mm') > -1) {
                option += minutes + '</ul>';
            }
            if (this.option.format.indexOf('ss') > -1) {
                option += seconds + '</ul>';
            }
            option += `</div><div class="time-btns"><span class="cur-time">当前时间</span><a class="confirm-time">确定</a></div></div>`;
            html += ` <div class="time-picker">` + option + `</div>
         </div>
      `
            this.$targetDom.append(html)
            this.$container=$("#"+this.id);
            this.changeShowStatus(true)
        },
        addEvent(){
            this.$targetDom.get(0).addEventListener("click",(e)=>{
                var $t=$(e.target);
                this.selectTime($t.parents(".timecont").eq(0), $t);
            })
            this.$container.get(0).addEventListener("click",(e)=>{
                var $t=$(e.target);
                // if ($t.parents(".timecont")[0]) {
                //     this.selectTime($t.parents(".timecont").eq(0), $t);
                // }
                if($t.hasClass("confirm-time")){
                    this.confirm();
                }
                if($t.hasClass("cur-time")){
                    var hour=dayjs().format('HH');
                    var minute=dayjs().format('mm');
                    var second=dayjs().format('ss');
                    var time=hour+':'+minute+':'+second;
                    this.trigger("confirm",{str:time,value:{hour:hour,minute:minute,second:second}})
                    this.changeShowStatus(true)
                }
            })
        },
        selectTime($ele, $target) {
            var that = this;
            if ($target.parent().hasClass("timecont")) {
                // $ele.children("div").toggle();
                if ($ele.children("div").get(0).style.display == 'none') {
                    return;
                }
                var curTime = $ele.children("span").get(0).innerHTML.split(":");
                var hour = curTime[0];
                var minute = curTime[1];
                var second = curTime[2];
                $ele.find(".on").removeClass("on")
                $ele.find(".hours li[data-i='" + hour + "']").addClass("on")
                $ele.find(".minutes li[data-i='" + minute + "']").addClass("on")
                $ele.find(".seconds li[data-i='" + second + "']").addClass("on")
                $ele.find(".on").each((ele,i) => {
                    var top = $(ele).position().top - 20;
                    $(ele).parent().get(0).scrollBy(0, top)
                })
                return;
            }
            if ($target.get(0).nodeName == 'LI') {
                $target.parent().find("li").removeClass("on")
                $target.addClass("on")
                return;
            }
        },
        confirm(){
            var hour=(this.$container.find(".hours .on").attr("data-i") || '00');
            var minute=(this.$container.find(".minutes .on").attr("data-i") || '00');
            var second=(this.$container.find(".seconds .on").attr("data-i") || '00');
            var time=dayjs('1900-08-08 ' + hour + ':' + minute + ':' + second).format(this.format||'HH:mm:ss');
            this.trigger("confirm",{str:time,value:{hour:hour,minute:minute,second:second}})
            this.changeShowStatus(true)
        },
        trigger(type,data){
            if(this.eventList[type]){
                for(let i=0;i<this.eventList[type].func.length;i++){
                    this.eventList[type].func[i](data);
                }
            }
        },
        on(type,func){
            if(!this.eventList[type]){
                this.eventList[type]={
                    func:[func]
                }
            }
            else{
                this.eventList[type].func.push(func)
            }
        },
        getRandomString(len) {
            len = len || 8;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
            /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
    }
    window.XNTimepicker = XNTimepicker;
})(window, XNQuery)
export default window.XNTimepicker
