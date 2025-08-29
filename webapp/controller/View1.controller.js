
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {

        onInit: function() {
        },

		onAbrirDialogInfo: function(oEvent) {
			var that = this;
            var sName = "zov.view.DialogInfo";

            if(!this.oDialog){
                // this.loadFragment({
                //     name: sName
                // }).then(function(oDialog2) {
                //     that.oDialog = oDialog2;
                //     that.oDialog.open();
                // }.bind(this));

                this.oDialog = this.byId("DialogInfo");
                that.oDialog.open();

            } else {
                this.oDialog.open();
            }
		},

		onFecharDialogInfo: function(oEvent) {
			// this.byId("DialogInfo").close();
            this.oDialog.close();
        }

    });
});