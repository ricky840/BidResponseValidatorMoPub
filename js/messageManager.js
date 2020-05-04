var messageManager = (function(global) {
	"use strict";

	function show(message, type) {
		let typeList = "positive negative info success warning"
		$(".ui.message").removeClass("hidden visible").addClass("visible");
		$(".ui.message").removeClass(typeList).addClass(type);
		$(".ui.message > .header").html(message.header);
		$(".ui.message > p").html(message.content);
	}
 
  return {
		show: show
  }
})(this);

