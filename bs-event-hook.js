/*!
 * jQuery plugin
 * bs-event-hook.js extends functionality to the mediaqueries steps.
 * Add functions to be called in each step.
 *
 * For using custom steps set the customSteps option like the following :
 *      customSteps : [
 *          [320, 425],
 *          [1200, 9999]
 *      ]
 * To simulate "width < X" => [-1, x]
 * To simulate "width > X" => [x, 9999]
 *
 * How to :
 *     Use addFuncs to set the callback. Use a clousure to keep the function scope.
 * Example call :
 *     $().bsEventHook('addFuncs', function(){
 *         hackIPs();
 *         getBankNumber();
 *     });
 */
(function( $ ) {

    var methods = {
        addFuncs : function( f ) {
            $.fn.bsEventHook.settings.stepFuncs.push(f);
            start();
        },
        init : function (opts) {
            // Extend our default options with those provided.
            // This is a destructive operation; Any attribute with the same name as a field in defaults will be overridden.
            $.fn.bsEventHook.settings = $.extend( {}, $.fn.bsEventHook.settings, opts );
            start();
        }
    };

    $.fn.bsEventHook = function( methodOrOptions ) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // default to 'init'
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.bs-event-hook');
        }

    };

    // main flag to check if the plugin is running
    var running = false;
    var lastWidth = $( window ).width();

    function start() {
        /*
            Set the resize event listening to the steps defined and executing the functions requested.
        */
        if (running) {
            return;
        }
        running = true;

        // reference to the settings and steps
        var settings = $.fn.bsEventHook.settings;
        _steps = settings.bootstrapSteps;
        if (settings.customSteps && settings.customSteps.length && checkWellFormedSteps(settings.customSteps)) {
            _steps = settings.customSteps;
        }

        resizeTimeout = null;
        $( window ).resize(function() {
          if(!!resizeTimeout){ clearTimeout(resizeTimeout); }
            resizeTimeout = setTimeout(executeMediaStep, settings.renderTimeout);
        });
    }

    function executeMediaStep(){
        /* main function executed on each step */
        // obtain current width
        var currentWidth = viewport().width;
        // call the stepFunc whenever the currentWidth is in a new step
        if (getStep(lastWidth) != getStep(currentWidth)) {
            lastWidth = currentWidth;
            //call stepFuncs
            $.each($.fn.bsEventHook.settings.stepFuncs, function(i, callback){
                if (typeof callback === "function") {
                    callback();
                }
            });
        }
    }

    // Plugin defaults & settings – added as a property on our plugin function.
    $.fn.bsEventHook.defaults = {
        renderTimeout: 250,
        stepFuncs: [],
        customSteps: [],
        bootstrapSteps: [
            [320, 425],
            [425, 500],
            [500, 620],
            [620, 767],
            [767, 991],
            [991, 1200],
            [1200, 9999]  // trick to simulate : "width >= 1200"
        ]
    };

    // set the default settings ( deep copy )
    $.fn.bsEventHook.settings = $.extend(true, {}, $.fn.bsEventHook.defaults);

    function viewport() {
        var e = window, a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
    }

    function getStep(width) {
        // Checks the step the width is in (returns the lower endpoint)
        // -1 if not found

        for (var i=0; i < _steps.length; i++) {
            lEndPoint = _steps[i][0];
            rEndPoint = _steps[i][1];
            if (lEndPoint < width && width <= rEndPoint) return lEndPoint
        }
        return -1
    }

    function checkWellFormedSteps(steps) {
        if (checkForDuplicates(steps)) {
            console.log("bs-event-hook.js : duplicated steps found");
            return false;
        }

        // check for interval overlapping
        for (currStep in steps) {
            for (step in steps) {
                // skip itself
                if(JSON.stringify(steps[currStep].sort()) === JSON.stringify(steps[step].sort()))
                {
                    continue;
                }

                x = steps[currStep];
                y = steps[step];
                if (x[0] < y[1] && y[0] < x[1]) {
                    console.log("bs-event-hook.js : step overlapping x=" + x[0]+","+ x[1]+ " y= " + y[0]+","+ y[1]);
                    return false;
                }
                else {
                    //console.log("not overlapping");
                }
            }
        }
        // well formed :9
        return true;
    }

    function checkForDuplicates(steps)
    {
        var stepsSorted = steps.slice().sort();
        for (var i = 0; i < steps.length - 1; i++) {
            if (JSON.stringify(stepsSorted[i + 1]) == JSON.stringify(stepsSorted[i])) {
                return true;
            }
        }
        // not found :(
        return false;
    }

}( jQuery ));