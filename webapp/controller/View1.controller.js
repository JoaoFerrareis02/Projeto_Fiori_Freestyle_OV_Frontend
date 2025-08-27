sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        onInit() {
            var oView = this.getView();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ "usuario": { "nome": "Marcus Vinícius" } });
            oView.setModel(oModel);
        },

        onExibirMensagem() {
            var i18n = this.getView().getModel("i18n").getResourceBundle();
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
            var title = i18n.getText("welcomeMsg", [oData.usuario.nome])
            alert(title);
        }

    });
});