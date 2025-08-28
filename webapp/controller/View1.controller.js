
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
	"sap/m/MessageToast"
], (Controller,
	JSONModel,
	Filter,
	FilterOperator,
	Sorter,
	MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        onInit: function () {
            const oView = this.getView();
            const oFModel = new JSONModel();
            const oTModel = new JSONModel();

            oFModel.setData({
                "OrdemId": "",
                "DataCriacao": "",
                "CriadoPor": "",
                "ClienteId": "",
                "TotalItens": "",
                "TotalFrete": "",
                "TotalOrdem": "",
                "Status": "",
                "OrdenacaoCampo": "OrdemId",
                "OrdenacaoTipo": "ASC",
                "Limite": 10,
                "Offset": 0
            });

            oView.setModel(oFModel,"filter");
            oTModel.setData([]);
            oView.setModel(oTModel,"table");

            this.onFilterSearch();

        },

        onFilterSearch: function () {
            let oView = this.getView();
            let oModel = this.getOwnerComponent().getModel();
            let oFModel = oView.getModel("filter");
            let oTModel = oView.getModel("table");
            let oFData = oFModel.getData();
            let oFilter = null;
            let oSort = null;
            let bDescending = false;
            let aParams = [];
            let that = this;
            let aSorter = [];
            let aFilters = [];

            if (oFData.OrdemId != "") {
                oFilter = new Filter({
                    path: "OrdemId",
                    operator: FilterOperator.EQ,
                    value1: oFData.OrdemId
                });
                aFilters.push(oFilter);
            }

            if (oFData.DataCriacao != "") {
                oFilter = new Filter({
                    path: "DataCriacao",
                    operator: FilterOperator.EQ,
                    value1: oFData.DataCriacao
                });
                aFilters.push(oFilter);
            }

            if (oFData.ClienteId != "") {
                oFilter = new Filter({
                    path: "ClienteId",
                    operator: FilterOperator.EQ,
                    value1: oFData.ClienteId
                });
                aFilters.push(oFilter);
            }

            if (oFData.OrdenacaoTipo == "DESC") {
                bDescending = true;
            }

            oSort = new Sorter(oFData.OrdenacaoCampo, bDescending);
            aSorter.push(oSort);

            aParams.push(`$top=${oFData.Limite}`);
            aParams.push(`$skip=${oFData.Offset}`);

            this.getView().setBusy(true);
            oModel.read("/OVCabSet", {
                sorters: aSorter,
                filters: aFilters,
                urlParameters: aParams,
                success: function(oData2, oResponse){
                    that.getView().setBusy(false);
                    oTModel.setData(oData2.results);
                },
                error: function(oError){
                    that.getView().setBusy(false);
                    MessageToast.show("Erro");
                }
            });

        },

        onFilterReset: function (oEvent) {

        },

		onAtualizarStatus: function(sStatus) {
			const oTable = this.getView().byId("table1");
            const oModel = this.getOwnerComponent().getModel();
            const aIndex = oTable.getSelectedIndices();
            const that = this;
            
            if (aIndex.length == 0) {
                MessageToast.show("Selecione uma linha");
                return;
            }

            if (aIndex.length != 1) {
                MessageToast.show("Selecione apenas uma linha");
                return;
            }

            let oItem = oTable.getContextByIndex(aIndex[0]);
            let iOrdemId = oItem.getProperty("OrdemId");

            this.getView().setBusy(true);
            oModel.callFunction("/ZJV_FI_ATUALIZA_STATUS", {
                method: 'GET',
                urlParameters: {
                    ID_STATUS: sStatus,
                    ID_ORDEMID: iOrdemId
                },
                success: (oData, oResponse) => {
                    that.getView().setBusy(false);
                    MessageToast.show("Status atualizado com sucesso");
                    that.onFilterSearch();
                },
                error: (oError) => {
                    that.getView().setBusy(false);
                    MessageToast.show("Erro ao atualizar status");
                }
            });

		}

    });
});