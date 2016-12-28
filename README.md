# bootstrap-steps-eventhook
Plugin to fire JS in each bootstrap window size step.

### Installation

bootstrap-steps-eventhook requires [jQuery](http://code.jquery.com/jquery-latest.js)

Add the js file to your project.

### Usage

Add any javascript code to the 'addFuncs' function. 

```javascript
$().bsEventHook('addFuncs', function(){
	hackIPs();
	getBankNumber();
});
```
Now anytime bootstrap detects a change in the window size and moves to another step those functions will be called.

Add some options to the 'init' function. 
```javascript
$().bsEventHook('init', {
		renderTimeout: 500,
		customSteps: [ 
            [320, 620],
            [620, 1800]
        ]}
});
```
Amount of options to customize : 

	* renderTimeout  : Delay to execute the functions. ( Default 250ms )
	* stepFuncs 	 : Change the js code executed by default
	* customSteps 	 : Define your own steps as an interval list  ( Default bootstrap steps )


