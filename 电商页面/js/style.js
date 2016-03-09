$(function(){

    // 切换搜索框
    (function(){

        var $oLi = $("#menu li");
        var $oTxt = $(".form .text");

        // 这块儿数据应该从ajax中拿出来
        var arrText = [
            '例如：荷棠鱼坊烧鱼 或 樱花日本料理',
            '例如：昌平区育新站龙旗广场2号楼609室',
            '例如：万达影院双人情侣券',
            '例如：东莞出事了，大老虎是谁？',
            '例如：北京初春降雪，天气变幻莫测'
        ];
        var iNum = 0;

        $oTxt.val( arrText[ iNum ] );


        $oLi.each(function(index){
            $(this).click(function(){
                $(this).addClass("curr").siblings().removeClass("curr");

                iNum = index;

                $oTxt.val( arrText[ iNum ] )
            });
        });

        

        $oTxt.focus(function(){
            if( $(this).val() == arrText[iNum] ){
                $(this).val('');
            }
        });

        $oTxt.blur(function(){
            if( $(this).val() == ''){
                $(this).val(arrText[iNum]);
            }
        });
    })();

    // update文字滚动,自己修改为无缝滚动
    (function(){
        var str = '',iH=0,timer = null,iCurr = 0,$oLi,
            $oDiv = $('.update'),
            $oUl = $oDiv.find("ul"),
            arrData = [
                { 'name':'萱萱', 'time':4, 'title':'那些灿烂华美的瞬间', 'url':'http://www.miaov.com/2013/' },
                { 'name':'畅畅', 'time':5, 'title':'广东3天抓获涉黄疑犯', 'url':'http://www.miaov.com/2013/#curriculum' },
                { 'name':'萱萱', 'time':6, 'title':'国台办回应王郁琦', 'url':'http://www.miaov.com/2013/#about' },
                { 'name':'畅畅', 'time':7, 'title':'那些灿烂华美的瞬间', 'url':'http://www.miaov.com/2013/#message' },
                { 'name':'萱萱', 'time':8, 'title':'那些灿烂华美的瞬间', 'url':'http://www.miaov.com/2013/' },
                { 'name':'畅畅', 'time':9, 'title':'广东3天抓获涉黄疑犯', 'url':'http://www.miaov.com/2013/#curriculum' },
                { 'name':'萱萱', 'time':10, 'title':'国台办回应王郁琦', 'url':'http://www.miaov.com/2013/#about' },
                { 'name':'畅畅', 'time':11, 'title':'那些灿烂华美的瞬间', 'url':'http://www.miaov.com/2013/#message' }
            ];

        for(var i = 0; i < arrData.length; i++ ){
            str += '<li><a href="'+arrData[i].url+'"><span class="name">'+arrData[i].name+'</span><span class="time">'+arrData[i].time+'分钟前</span>'+arrData[i].title+'</a></li>';
        }

        $oUl.html( str );

        iH = $oUl.find("li").height();


        $("#updateUpBtn").click(function(){
            doMove( -1 );
        });

        $("#updateDownBtn").click(function(){
            doMove(1);
        });

        $oDiv.hover(function(){
            clearInterval(timer);
        }, autoPlay)

        function doMove( num ){
            iCurr += num;

            
            if( iCurr < -(arrData.length -1) ){
                iCurr = -1;

                // 实现无缝文字滚动
                $oLi = $oUl.find("li").last().remove();
                $oUl.prepend( $oLi );
                $oUl.css({top:0});
            }

            if( iCurr > 0 ){
                iCurr = -(arrData.length -2);

                $oLi = $oUl.find("li").first().remove();
                $oUl.append( $oLi );
                $oUl.css({top:-(arrData.length -1)*iH});
            }

            $oUl.stop().animate({top: iH*iCurr}, 1000);
        }

        function autoPlay(){
            timer = setInterval(function(){
                doMove(-1)
            },2500);
        }

        autoPlay();
    })();

    // 选项卡
    (function(){

        tabFn( $(".tabjs1"), $('.tab_con1'));
        tabFn( $(".tabjs2"), $('.tab_con2'));
        tabFn( $(".tabjs3"), $('.tab_con3'),'mouseover');
        tabFn( $(".tabjs4"), $('.tab_con4'),'mouseover');

        function tabFn( oNav, oCon, oEvent ){
            var $aNav = oNav.children();
            var $aCon = oCon.children();
            var sEvent = oEvent || 'click';
            $aCon.hide().eq(0).show();

            $aNav.each(function(index){
                $(this).on( sEvent, function(){
                    $aNav.removeClass('curr');
                    $(this).addClass('curr')

                    $aNav.find("a").attr('class','triangle_down_gray');
                    $(this).find("a").attr('class','triangle_down_red');

                    $aCon.hide().eq( index ).show()
                    
                });
            })
        }
    })();

    // 淡入淡出效果
    (function(){

        var arrIntro = ['爸爸去哪儿啦~', '人像摄影中的光影感', '娇柔妩媚、美艳大方'];
        var $oDiv = $(".slider");
        var $oUli = $oDiv.find('ul li');
        var $oOli = $oDiv.find('ol li'), timer=null;
        var $oP = $oDiv.find('p'), iNow = 0;

        
        fnFade( iNow );
        autoPlay()


        $oOli.click(function(e){
            var iNow = $(this).index();

            fnFade( iNow );
            return false;
        });

        $oDiv.hover(function(){
            clearInterval(timer)
        }, autoPlay);

        function autoPlay(){
            timer = setInterval(function(){
                iNow++;
                iNow %= arrIntro.length;
                fnFade( iNow );
            }, 3000);
        }

        function fnFade( num ){

            $oUli.each(function(i){
                if( i != num ){
                    $oUli.eq(i).fadeOut().css('zIndex',1);
                    $oOli.eq(i).removeClass('curr');
                }else{
                    $oUli.eq(i).fadeIn().css('zIndex',2);
                    $oOli.eq(i).addClass('curr');
                }
            });

            $oP.text( arrIntro[num] );
        }

    })();

    // 日历制作
    (function(){
        var date = new Date(), now = {}, days,j,strTd='',strTr='',count=0/*表示日期的计时器*/,nextCount = 1/*下个月的计数器*/;
        var $oTable = $(".calender table");

        // 获得当前时间
        now.year = date.getFullYear();
        now.month = date.getMonth();
        now.day = date.getDate();

        // 得到这个月有多少天
        days = new Date( now.year, now.month+1, 0).getDate();

        // 得到上个月有多少天
        prevDays = new Date( now.year, now.month, 0).getDate();

        // 得到这个月第一天是星期几
         day = new Date( now.year, now.month, 1).getDay();

        // 计算在这个月的第一天之前还有几天是上个月的时间，因为基于星期一开始的，所以-1
        j = day -1;

        // 第一排的日期
        for( var i = prevDays; i > prevDays -j; i-- ){
            strTd += '<td data-date="'+ now.year+'/'+now.month+'/'+i+'" class="disable">'+i +'</td>';
        }
        for( var i = day-1; i < 7; i++ ){
            count++;
            if( count == now.day ){
                strTd += '<td data-date="'+ now.year+'/'+(now.month+1)+'/'+count+'" class="curr">'+ count +'</td>';
            }else{
                strTd += '<td data-date="'+ now.year+'/'+(now.month+1)+'/'+count+'">'+ count +'</td>';
            }
        }
        strTr +='<tr>'+strTd+'</tr>';
        strTd='';

        for( var i = 0; i < 5; i++ ){

            for( var n = 1; n <= 7; n++){
                count++;

                if( count > days ){
                    
                    strTd += '<td data-date="'+ now.year+'/'+(now.month+2)+'/'+nextCount+'" class="disable">'+ nextCount +'</td>';
                    nextCount++;
                } else{
                    if( count == now.day ){
                        strTd += '<td data-date="'+ now.year+'/'+(now.month+1)+'/'+count+'" class="curr">'+ count +'</td>';
                    }else{
                        strTd += '<td data-date="'+ now.year+'/'+(now.month+1)+'/'+count+'">'+ count +'</td>';
                    }
                    
                }
            }
            strTr += '<tr>'+strTd+'</tr>';
            strTd='';
        }

        $oTable.empty()
        $oTable.append( strTr );
    })();

    // 日历Prompt
    (function(){

        var $oDiv = $('.calender');
        var $oTd = $oDiv.find('td'),date, str='';
        var $oPrompt = $oDiv.find('td.pr');
        var arrData = [
            {'time': "2016/3/10",'title':'李宇春生日快乐','intro':'每年3月10日都是李宇春的生日，届时也是全国喜欢李宇春的人的节日','simg':'img/content/td_bg2.jpg','bimg':'img/content/prompt.jpg'},
            {'time': "2016/3/22",'title':'莫名其妙的日子','intro':'莫名其妙的日子，就应该说一些莫名其妙的话，疯言疯语','simg':'img/content/td_bg1.jpg','bimg':'img/content/today.jpg'}
        ];
       var arrDay = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

        $oTd.each(function(){
            date = $(this).data('date');
            for( var i = 0 ; i < arrData.length; i++ ){
                if( date == arrData[i].time ){
                    var arrTime = arrData[i].time.split("/");

                    // 这一天是星期几
                    var day = new Date( arrTime[0], arrTime[1]-1,arrTime[2]).getDay();

                    $(this).addClass("pr");
                    $(this).css('background',"url("+arrData[i].simg+")" );

                    str += '<div class="prompt"><a href="" class="img"><img src="'+arrData[i].bimg+'" alt=""></a>'+
                            '<div class="text"><h3><strong>'+arrDay[day]+'</strong>'+arrData[i].title+'</h3><p>'+arrData[i].intro+'</p>'+
                            '<a class="btn"></a></div></div>';

                    $(this).append(str);
                    str = '';

                }
            }
            
        });


        $oDiv.delegate( $oPrompt, 'mouseover', function(e){
            if( $(e.target).hasClass('pr') ){
                $(e.target).find('.prompt').show();
            }
        });
        $oDiv.delegate( $oPrompt, 'mouseout', function(e){
            if( $(e.target).hasClass('pr') ){
                $(e.target).find('.prompt').hide();
            }
        })
    })();

    // BBS部分效果
    (function(){
        var $oLi = $(".lt_list li")
        $oLi.mouseover(function(){
            $oLi.removeClass('curr');
            $(this).addClass('curr');
        })
    })();

    // HOT图片遮罩部分效果
    (function(){
        var arr = [
            '',
            '用户1<br />人气1',
            '用户名：性感宝贝<br />区域：朝阳CBD<br />人气：124987',
            '用户3<br />人气3',
            '用户4<br />人气4',
            '用户5<br />人气5',
            '用户6<br />人气6',
            '用户7<br />人气7',
            '用户8<br />人气8',
            '用户9<br />人气9',
            '用户10<br />人气10'
        ];

        var $oLi = $(".famous li")
        $oLi.mouseenter(function(){
            
            var $this = $(this);
            if( $this.index() == 0 ) return;
            
            $this.append('<p style="width: '+($this.width()-10)+'px;height:'+($this.height()-10)+'px">'+arr[$this.index()]+'</p>');
        });
        $oLi.mouseleave(function(){
            $oLi.find("p").remove();
        });


    })();
});