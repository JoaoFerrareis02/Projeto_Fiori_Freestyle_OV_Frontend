sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
	"sap/ui/core/routing/History"
], (Controller,
	UIComponent,
	History) => {
    "use strict";

    return Controller.extend("zov.controller.CustomerFormView", {
        onInit: function () {
            var oRouter = UIComponent.getRouterFor(this);

            oRouter.getRoute("RouteCustomerNew").attachMatched(this._onRouteMatchedNew, this);
            oRouter.getRoute("RouteCustomerEdit").attachMatched(this._onRouteMatcheEdit, this);
        },

		onNavBack: function(oEvent) {
			var r = UIComponent.getRouterFor(this);
            r.navTo("RouteView1");
		},

		onView1: function(oEvent) {
			const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var r = UIComponent.getRouterFor(this);
                r.navTo("RouteView1");
            }
            
		},

		_onRouteMatchedNew: function(oEvent) {
			alert("Modo criação do cliente");
		},

		_onRouteMatcheEdit: function(oEvent) {
			var that = this;
            var oArgs = oEvent.getParameter("arguments");
            var sCustomerId = oArgs.CustomerId;

            alert(`Modo modificação do cliente ${sCustomerId}`);
		}

    });
});