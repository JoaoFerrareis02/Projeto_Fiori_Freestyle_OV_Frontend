sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("zov.controller.Footer", {

        onInit: function() {
        },
		onFooter: function(oEvent) {
			alert("onFooter");
		}
	});
});