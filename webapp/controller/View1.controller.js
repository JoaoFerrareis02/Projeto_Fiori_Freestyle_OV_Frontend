sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        onInit: function () {
            // model padrão da view
            /* var oView = this.getView();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ "usuario": { "nome": "Marcus Vinícius" } });
            oView.setModel(oModel); */

            //model com o nome "dados"
            var oView = this.getView();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ "usuario": { "nome": "João Victor" } });
            oView.setModel(oModel, "dados");
        },

        onTestModels: function (oEvent) {
            //model i18n
            var o18n = this.getView().getModel("i18n").getResourceBundle();
            var sText = o18n.getText("title");

            console.log("Texto com a chave 'title'");
            console.log(sText);

            console.log("----------------------------------------");

            //model de usuários
            var oModel = this.getOwnerComponent().getModel("usuarios");
            var oData = oModel.getData();
            console.log("Model dos usuários");
            console.log(oData);

            console.log("----------------------------------------");

            //model do serviço
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/OVCabSet", {
                success: function (oData, oResponse) {
                    console.log("Dados retornados do serviço");
                    console.log(oData);
                    console.log(oResponse);
                },
                error: function (oError) {
                    console.log(oError);
                }
            })

        }



    });
});