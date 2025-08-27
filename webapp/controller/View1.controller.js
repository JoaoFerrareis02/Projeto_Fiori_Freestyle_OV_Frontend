sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        onInit() {
        },
		onPress: function(oEvent) {
			alert("Hello World!!!")
		}
    });
});