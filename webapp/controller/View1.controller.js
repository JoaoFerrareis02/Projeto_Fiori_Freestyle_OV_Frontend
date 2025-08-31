sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], (Controller,
    UIComponent) => {
    "use strict";

    return Controller.extend("zovfrontend.controller.View1", {
        onInit() {
        },

        onCadastroOrdem: function (oEvent) {
            const oRoute = UIComponent.getRouterFor(this);
            oRoute.navTo("RouteFormularioCadastro")
        }
    });
});