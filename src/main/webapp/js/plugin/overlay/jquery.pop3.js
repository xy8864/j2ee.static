/*
@name: jQuery Plugin Template for Coding
*/
;(function($) {//[--jQuery Plugin Container

//declare the plugin's version ; use to check the plugin exists
$.pop3 = $.pop3 || {version:'0.1.0'};

//[--Plugin Define
var pop3 = function(node,opts) {

    var me=this,$me=$(this);
    var $mine=$(node); //get the plugin's Operation jQuery DOM Element

    //Public Methods
    $.extend(me, {
        show: function() {
            __show__();
        },
        hide: function() {
            __hide__();
        },
        options: function() {
            //return the preset options to users code
            //let users can be change options by later code
            return opts;
        }
    });

    //Private Variables ( Module Level )
    var m_var1, m_var2, m_var3;

    //init the plugin
    function __init__(){
        //alert('jQuery Plugin init');
        $mine.css({'float':'left','cursor':'pointer'});
		$content = $mine.next(".pop").wrap("<div class='popwrap ui-widget ui-widget-content ui-corner-all'></div>");
		$mine.append('<span class="ui-icon ui-icon-triangle-1-e" style="float:right;"></span>').addClass("ui-state-default ui-widget ui-corner-all").removeClass("ui-state-active");
		$mine.toggle(
			  function () {
				$(this).addClass("ui-state-active").removeClass("ui-state-default");
				//todo
				//caculate the width and height
				$mine.next(".popwrap").find(".pop").show().end().css({"width":"100%" + "px","height":opts.height}).slideDown();
				//caculate the position;
				// like cluetip, position the width and then position the height( left, top);
			  },
			  function () {
				$(this).addClass("ui-state-default").removeClass("ui-state-active");
				$mine.next(".popwrap").slideUp("fast");
			  }
		);
        //if (opts.autoShow) __show__();
    }
    __init__();

    //Private Functions
    function __show__(){
        //function code
        //$mine.text('Hello jQuery Plugin !');
        //call the event
        opts.onShow(me,opts);
    }

    function __hide__(){
        //function code
        $mine.text('');
        //call the event
        opts.onHide(me,opts);
    }


};//--]Plugin Define


//jQuery Plugin Implementation
$.fn.pop3 = function(conf) {

    //return existing instance // let users can use the Public Methods
    //Usage: var obj = $('#id').pop3({ <options> }).data("pop3");
    var el = this.eq(typeof conf == 'number' ? conf : 0).data("pop3");
    if (el) { return el; }

    //setup default options
    var opts = {
		width : 476,
		height :"auto",
        autoShow:true,
        onShow:function(e,o){},
        onHide:function(e,o){},
        api:false
    };

    //if no users options then use the default options
    $.extend(opts, conf);

    // install the plugin for each items in jQuery
    this.each(function() {
        el = new pop3(this, opts);
        $(this).data("pop3", el);
    });

    //api=true let users can immediate use the Public Methods
    return opts.api ? el: this;

};


})(jQuery);//--]jQuery Plugin Container
