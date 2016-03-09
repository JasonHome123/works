function MouseEvent(e){
    this.x = e.pageX;
    this.y = e.pageY;
}
(function($){
    $.fn.imagezoom = function(options){
        var settings = {
            xzoom: 310,
            yzoom: 310,
            offset: 10,
            position: "BTR"
        };

        if( options ) {
            $.extend( settings, options );
        }
        var noalt = '';
        var self = this;
        $(this).bind("mouseenter", function(e){
            // offset()当前元素相对于文档的的偏移量
            var imgLeft = $(this).offset().left,
                imgTop = $(this).offset().top,
                // offsetWidth是指该对象可见的宽度
                imgWidth = $(this).get(0).offsetWidth,
                imgHeight = $(this).get(0).offsetHeight,
                boxLeft = $(this).parent().offset().left,
                boxTop = $( this).parent().offset().top,
                boxWidth = $(this).parent().width(),
                boxHeight = $(this).parent().height(),

                img_src = $(this).attr("rel");


                if( $("div.zoomDiv").get().length == 0){
                    $(document.body).append("<div class='zoomDiv'><img class='bigimg' src='" + img_src + "'/></div><div class='zoomMask'>&nbsp;</div>");
                }

                // 如果position的参数不为“BTR”，则zoomDIV将在左边边展示
                if( settings.position == "BTR" ){
                    if(boxLeft + boxWidth + settings.offset + settings.xzoom > screen.width ){
                        leftpos = boxLeft - settings.offset - settings.xzoom
                    } else {
                        leftpos = boxLeft + boxWidth + settings.offset;
                    }
                } else{
                    leftpos = imgLeft -settings.xzoom - settings.offset;
                    if( leftpos < 0 ){
                        leftpos = imgLeft + imgWidth + settings.offset;
                    }
                }

                $("div.zoomDiv").css({
                    top: boxTop,
                    left: leftpos
                });
                $("div.zoomDiv").width(settings.xzoom);
                $("div.zoomDiv").height(settings.yzoom);
                $("div.zoomDiv").show();
                $(this).css("cursor","crosshair");

                $(document.body).mousemove(function(e){
                    var mouse = new MouseEvent(e);
                    if( mouse.x < imgLeft || mouse.x > imgLeft + imgWidth || mouse.y < imgTop || mouse.y > imgTop + imgHeight){
                        mouseOutImage();
                        return;
                    }

                    var bigwidth = $(".bigimg").get(0).offsetWidth;
                    var bigheight = $(".bigimg").get(0).offsetHeight;
                    var scalex = bigwidth / imgWidth;
                    var scaley = bigheight / imgHeight;
                    $("div.zoomMask").width( settings.xzoom / scalex);
                    $("div.zoomMask").height( settings.yzoom / scaley);
                    $("div.zoomMask").css("visibility","visible");

                    xpos = mouse.x - $("div.zoomMask").width() / 2;
                    ypos = mouse.y - $("div.zoomMask").height() / 2;
                    xposs = mouse.x - $("div.zoomMask").width() / 2 - imgLeft;
                    yposs = mouse.y - $("div.zoomMask").height() / 2 - imgTop;
                    xpos = (mouse.x - $("div.zoomMask").width() / 2 < imgLeft) ? imgLeft : (mouse.x + $("div.zoomMask").width() / 2 > imgWidth + imgLeft) ? (imgWidth + imgLeft - $("div.zoomMask").width()) : xpos;
                    ypos = (mouse.y - $("div.zoomMask").height() / 2 < imgTop) ? imgTop : (mouse.y + $("div.zoomMask").height() / 2 > imgHeight + imgTop) ? (imgHeight + imgTop - $("div.zoomMask").height()) : ypos;
                    $("div.zoomMask").css({
                        top: ypos,
                        left: xpos
                    });
                    $("div.zoomDiv").get(0).scrollLeft = xposs * scalex;
                    $("div.zoomDiv").get(0).scrollTop = yposs * scaley;
                });

                function mouseOutImage(){
                    $(document.body).unbind("mousemove");
                    $("div.zoomMask").remove();
                    $("div.zoomDiv").remove();
                }
        })
    }
})(jQuery);
