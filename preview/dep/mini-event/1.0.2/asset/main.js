/*! @2015 Leo Wang. All Rights Reserved */
define("mini-event/main",["require","./Event"],function(require){var e=require("./Event");return{version:"1.0.2",Event:e,fromDOMEvent:e.fromDOMEvent,fromEvent:e.fromEvent,delegate:e.delegate}}),define("mini-event",["mini-event/main"],function(e){return e});