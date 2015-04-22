(function($) {
    var originOpen = $.ui.dialog.prototype.open
    $.ui.dialog.prototype.open = function() {
        //var     event= window.event || arguments.callee.caller.arguments[0];
        //var event = event || window.event;
        var event = getEvent();
        //alert(event) // ie 和 ff下，都显示 "[object]" 
        var PosX = 0;
        var PosY = 0;
        if (event.pageX || event.pageY) {
            PosX = event.pageX;
            PosY = event.pageY;
        }
        else {
            PosX = event.clientX + document.body.scrollLeft - document.body.clientLeft;
            PosY = event.clientY + document.body.scrollTop - document.body.clientTop;
        };
        this.options.position = [PosX, PosY];
        //alert(this.options.position);
        originOpen.apply(this, arguments);
    };

    function getEvent() { //同时兼容ie和ff的写法 
        if (document.all) return window.event;
        func = getEvent.caller;
        while (func != null) {
            var arg0 = func.arguments[0];
            if (arg0) {
                if ((arg0.constructor == Event || arg0.constructor == MouseEvent)
                    || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    }
})(jQuery);