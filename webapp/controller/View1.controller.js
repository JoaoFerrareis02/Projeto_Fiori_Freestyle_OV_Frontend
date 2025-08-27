sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], (Controller,
    UIComponent) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        onInit: function () {
        },

        onNewCustomer: function (oEvent) {
            var r = UIComponent.getRouterFor(this);
            r.navTo("RouteCustomerNew");
        },

        onEditCustomer1: function (oEvent) {
            var r = UIComponent.getRouterFor(this);
            r.navTo("RouteCustomerEdit", { CustomerId: 1 });
        }

    });
});