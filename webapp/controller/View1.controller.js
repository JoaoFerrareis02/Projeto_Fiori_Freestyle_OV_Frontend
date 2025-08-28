
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], (Controller,
    JSONModel,
    Filter,
    FilterOperator,
    Sorter) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        onInit: function () {
            var oView = this.getView();

            var oModel = new JSONModel();

            oModel.setData({
                "OrdemId": "",
                "DataCriacao": "",
                "CriadoPor": "",
                "ClienteId": "",
                "TotalItens": "",
                "TotalFrete": "",
                "TotalOrdem": "",
                "Status": "",
                "OrdenacaoCampo": "OrdemId",
                "OrdenacaoTipo": "ASC"
            });

            oView.setModel(oModel, "filter");

            this.onFilterSearch();

        },

        onFilterSearch: function () {
            var oView = this.getView();
            var oTable = oView.byId("table1");
            var oModel = oView.getModel("filter");
            var oData = oModel.getData();
            var oFilter = null;

            var aSorter = [];
            var aFilter = [];

            if (oData.OrdemId != "") {
                oFilter = new Filter({
                    path: "OrdemId",
                    operator: FilterOperator.EQ,
                    value1: oData.OrdemId
                });
                aFilter.push(oFilter);
            }

            if (oData.DataCriacao != "") {
                oFilter = new Filter({
                    path: "DataCriacao",
                    operator: FilterOperator.EQ,
                    value1: oData.DataCriacao
                });
                aFilter.push(oFilter);
            }

            if (oData.ClienteId != "") {
                oFilter = new Filter({
                    path: "ClienteId",
                    operator: FilterOperator.EQ,
                    value1: oData.ClienteId
                });
                aFilter.push(oFilter);
            }

            var bDescending = false;
            if (oData.OrdenacaoTipo == "DESC") {
                bDescending = true;
            }

            var oSort = new Sorter(oData.OrdenacaoCampo, bDescending);
            aSorter.push(oSort);

            oTable.bindRows({
                path: '/OVCabSet',
                sorter: aSorter,
                filters: aFilter
            }); 

        },

        onFilterReset: function (oEvent) {

        }

    });
});