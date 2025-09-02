sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (
    Controller,
	MessageToast,
	History,
	UIComponent
) {
    "use strict";

    return Controller.extend("zovfrontend.controller.BaseController", {

        parseInt: function (sValue) {
            if (sValue == "" || sValue == null || sValue == undefined) {
                return 0;
            }

            sValue = parseInt(sValue);
            if (sValue == null || isNaN(sValue)) {
                sValue = 0;
            }
            return sValue;
        },

        parsePrice: function (sValue) {
            if (sValue == "" || sValue == null || sValue == undefined) {
                return 0.00;
            }

            if (typeof (sValue) == "number") {
                return sValue;
            }

            sValue = sValue.toString();

            if (sValue.indexOf(",") === -1) {
                return parseFloat(sValue);
            }

            sValue = sValue.toString().replaceAll(/[^0-9\.\,]/g, '');
            sValue = sValue.replace(/^0+/, '');
            sValue = sValue.replace(".", "");
            sValue = sValue.replace(",", ".");
            return parseFloat(sValue);
        },

        formatPrice: function (fPrice) {
            if (typeof (fPrice) != "number") {
                return "0,00";
            }
            var sPrice = fPrice.toFixed(2);
            sPrice = sPrice.replace(".", ",");
            return sPrice;
        },

        onPageBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                UIComponent.getRouterFor(this).navTo("RouteOrdemLista");
            }
        },

        onDeleteOrder: function (iOrdemId, callback) {
            var oModel1 = this.getOwnerComponent().getModel();
            var oView = this.getView();

            oView.setBusy(true);
            oModel1.remove(`/OVCabSet(${iOrdemId})`, {
                success: function (oData, oResponse) {
                    if (oResponse.statusCode == 204) {
                        MessageToast.show("Deletado com sucesso");
                        callback("S");
                    } else {
                        MessageToast.show("Erro em deletar");
                        callback("E");
                    }
                    oView.setBusy(false);
                },
                error: function (oError) {
                    MessageToast.show(oError.responseText);
                    callback("E");
                    oView.setBusy(false);
                }
            });
        }

    });
});