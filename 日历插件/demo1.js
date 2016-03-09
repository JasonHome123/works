(function(){

    function init(){
        var now = new Date(),
            nowYear = now.getFullYear(),
            nowMonth = now.getMonth(),
            nowMonthDay = getMonthDays( nowYear, nowMonth+1 ),
            nowDay1 = getDay1( nowYear, nowMonth );
            
           
        var nowPrevMonthDay = getMonthDays( nowYear, nowMonth );

        
        insertCell( nowMonthDay, nowPrevMonthDay, nowDay1);
        $(".calendar-hd h3").text(nowYear+"."+(nowMonth+1));
    }

    init();
    $(".prev").click(function(){

        var curr = getHd( true );
            //得到当前月份的总共天数
            currMonthDay = getMonthDays( curr.year, curr.month-1 );

            //得到当前月份的前一月份的总共天数
            var prevMonthDay = getMonthDays( curr.year, curr.month-2);

            // 得到当前月份1号是星期几
            currDay1 = getDay1( curr.year, curr.month-2 );

            insertCell( currMonthDay, prevMonthDay, currDay1);
        return false;
    });

    $(".next").click(function(){

        var curr = getHd( );
            //得到当前月份的总共天数
            currMonthDay = getMonthDays( curr.year, curr.month+1 );

            

            //得到当前月份的前一月份的总共天数
            var prevMonthDay = getMonthDays( curr.year, curr.month);
            
            // 得到当前月份1号是星期几
            currDay1 = getDay1( curr.year, curr.month );

            insertCell( currMonthDay, prevMonthDay, currDay1);
        return false;
    });

    // 获得日历头部的信息
    // 如果参数为true，则表示上一个月
    function getHd( bool ){
        var curr={}, yearMonth = $(".calendar-hd h3").text().split(".");
            curr.year = parseInt(yearMonth[0]),
            curr.month = parseInt(yearMonth[1]);

            $(".calendar-bd tr:not('.calendar-bd-hd')").remove();
            
            if( yearMonth[1] == "12" && !(bool) ){
                $(".calendar-hd h3").text( (curr.year+1)+".1");
                curr.year =curr.year + 1 ;
                curr.month = 0;
            } else if( yearMonth[1] == "1" && !!(bool)){
                $(".calendar-hd h3").text((curr.year-1)+".12");
                curr.month = 13;
                curr.year -= 1;
            } else {
                var hdStr = curr.year+"."+ (!!(bool) ? (curr.month-1) : (parseInt(curr.month)+1));
                $(".calendar-hd h3").text(hdStr);
            }
        return curr;
    }

    // 返回该月份的总共天数
    function getMonthDays( Y, M ){
        return new Date( Y, M, 0).getDate();
    }

    // 得到每月1号是星期几
    function getDay1( Y, M ){
        return new Date( Y, M, 1).getDay()
    }

    // 处理初始化，prev,next按钮重复部分代码
    /*
     * currDay1: 当前月份第一天星期几
     * currMonthDay: 月份的总共天数
     */
    function getData( currDay1,currMonthDay){
        var data = {}, leaveDay;

        //获得当前月份星期数量
        if( currDay1 == 0 ){
            data.currDay1 = 7;
        }else{
            data.currDay1 = currDay1;
        }
        leaveDay = currMonthDay - (7 - data.currDay1+1);
        data.weekTotal = Math.ceil( leaveDay /= 7);

        
        return data;
    }

    // 向table中添加td
    /*
     * prevDay: 当前月份的上一个月的月份总共天数
     * currDay1: 当前月份的1号是星期几
     * weekTotal: 一个月还剩下几个周
     * beginDay: 第二排数字从哪个位置开始
     * currMonthDay: 当前月份的总共天数
     */
    function insertCell( currMonthDay, prevDay, currDay1){
        var calStr = "<tr>",nextMonthDay = 1, ctrlNum=0;
       
        var data = getData( currDay1, currMonthDay )
            currDay1 = data.currDay1;
        // 得到前一月份在这个月的天数显示
        for( var i = prevDay-currDay1+1; i < prevDay; i++ ){
            calStr += "<td class='gray'>"+(i+1)+"</td>";
        }

        for( var i = 1; i <= 7 - currDay1 +1; i++ ){
            calStr +="<td>"+i+"</td>";
            ctrlNum++;
        }
        calStr += "</tr>";

        for(var i = 0; i < data.weekTotal; i++ ){
            calStr += "<tr>";
            for( var j = 1; j <= 7; j++){
                ctrlNum++;

                if( ctrlNum > currMonthDay){
                    
                    calStr +="<td class='gray'>"+nextMonthDay+"</td>";
                    nextMonthDay++;
                } else{
                    calStr +="<td>"+ctrlNum+"</td>";
                }
                
            }
            calStr += "</tr>";
        }

        $(".calendar-bd").append( calStr );
    }
})();