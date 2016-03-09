/*
 * author: wangxiaoer
 * time: 2015.11.25 15:14
 * version: 0.0.1
 * description: 
 * 1.实现月份前翻后翻
 * 2.实现日期选择
 * 3.目前代码还比较凌乱，继续加油更改。。。。
 */
(function(){

    function init(){
        var curr={}, inputVal = $(".calendar-input").val();
        if( !inputVal ){
            var now = today();
            curr.year = now.year;
            curr.month = now.month;
            curr.date = now.date;
        } else{
            var currArr = inputVal.split(".");
            curr.year = currArr[0];
            curr.month = parseInt(currArr[1]) -1 ;
            curr.date = currArr[2];
        }
        
        var nowMonthDay = getMonthDays(curr.year, curr.month+1 ),
        nowDay1 = getDay1( curr.year, curr.month );
        var nowPrevMonthDay = getMonthDays( curr.year, curr.month );
        insertCell( nowMonthDay, nowPrevMonthDay, nowDay1);
        $(".calendar-hd h3").text(curr.year+"."+(curr.month+1));
        todayStyle( curr );
    }
    function eventInit(){
        $(".prev").click(function(e){

            var curr = getHd( true ),

                currMonthDay = getMonthDays( curr.year, curr.month-1 ),

                prevMonthDay = getMonthDays( curr.year, curr.month-2),

                currDay1 = getDay1( curr.year, curr.month-2 );

            insertCell( currMonthDay, prevMonthDay, currDay1);

            todayStyle( curr );
            
            e.stopPropagation();
            e.preventDefault();
        });

        $(".next").click(function(e){

            var curr = getHd( );
                //得到当前月份的总共天数
                currMonthDay = getMonthDays( curr.year, curr.month+1 );

                //得到当前月份的前一月份的总共天数
                var prevMonthDay = getMonthDays( curr.year, curr.month);
                
                // 得到当前月份1号是星期几
                currDay1 = getDay1( curr.year, curr.month );

                insertCell( currMonthDay, prevMonthDay, currDay1);

            todayStyle( curr );
            e.stopPropagation();
            e.preventDefault();
        });

        $(".calendar").delegate(".calendar-bd td","click",function(){
            var hdStr = $(".calendar-hd h3").text();
            var date = $(this).text();
            if( $(this).hasClass("gray") ){
                var hdArr = hdStr.split(".");
                var year = parseInt(hdArr[0]);
                var month = parseInt(hdArr[1]);
                if( $(this).hasClass("nextDay")){
                    
                    month == 12 ? hdStr = (year+1)+".1" : hdStr = year + "." + (month+1);
                    
                } else if( $(this).hasClass("prevDay")){
                    month == 1 ? hdStr = (year-1)+".12" : hdStr = year + "." + (month-1);
                }
            } 

            $(this).parents('.calendar').siblings("input").val( hdStr + "."+date );
            
           $(this).parents(".calendar-bd").find("td").removeClass("today").end().end().addClass("today");
        });

        $(".calendar-input").click(function(e){

            $(".calendar").show();
            $(".calendar-bd tr:not('.calendar-bd-hd')").remove();
            init();
            e.stopPropagation();
        });

        $("body").click(function(){
            $(".calendar").hide();
        })
    }
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
    function getMonthDays( Y, M ){
        return new Date( Y, M, 0).getDate();
    }
    function getDay1( Y, M ){
        return new Date( Y, M, 1).getDay()
    }
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
    function insertCell( currMonthDay, prevDay, currDay1){
        var calStr = "<tr>",nextMonthDay = 1, ctrlNum=0;
       
        var data = getData( currDay1, currMonthDay )
            currDay1 = data.currDay1;
        // 得到前一月份在这个月的天数显示
        for( var i = prevDay-currDay1+1; i < prevDay; i++ ){
            calStr += "<td class='gray prevDay' >"+(i+1)+"</td>";
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
                    
                    calStr +="<td class='gray nextDay'>"+nextMonthDay+"</td>";
                    nextMonthDay++;
                } else{
                    calStr +="<td>"+ctrlNum+"</td>";
                }
                
            }
            calStr += "</tr>";
        }

        $(".calendar-bd").append( calStr );
        
    }
    function today(){
        var now = {}, date = new Date();
            now.year = date.getFullYear(),
            now.month = date.getMonth(),
            now.date = date.getDate();

        return now;
    }
    function todayStyle(curr){
        var now = curr;
        var hdStr = $(".calendar-hd h3").text();
    
        if( hdStr == now.year + "." +(now.month+1)){

            $.each( $(".calendar-bd td"), function( key, el ){
                if( $(el).text() == now.date && !($(el).hasClass("gray"))){
                    $(el).parents(".calendar-bd").find("td").removeClass("today").end().end().addClass("today");
                }
            })
            
            
        }
    }
    eventInit();
})();