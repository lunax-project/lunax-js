Lunax JS
--

## Dependencies ##
    * jQuery.js
    * History.js


Using LunAjax.js:
````javascript
$("element").LunAsync("#main"/* Destination data */, {
  animation: "#my-loading", // Element with loading
  animation_delay: 1000, // Delay after loading default is 1000ms

  start: function() {
    // Action before start
  },

  success: function(data) {
    // Action after success
  },

  error: function(e) {
    // Action on error
  },

  complete: function() {
    // Action after complete
  }
});
````
