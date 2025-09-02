sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "zovfrontend/model/formatter",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], (Controller,
	formatter,
	JSONModel,
	UIComponent,
	Filter,
	FilterOperator,
	Sorter) => {
    "use strict";

    return Controller.extend("zovfrontend.controller.OrdemLista", {

        formatter: formatter,

        onInit: function () {
            var oView = this.getView();
            var oFModel = new JSONModel();

            oFModel.setData({
                "OrdemId": "",
                "DataCriacao": null,
                "CriadoPor": "",
                "ClienteId": "",
                "TotalItens": 0,
                "TotalFrete": 0,
                "TotalOrdem": 0,
                "Status": "",
                "OrdenacaoCampo": "OrdemId",
                "OrdenacaoTipo": "ASC",
                "Limite": 25,
                "Ignorar": 0
            });
            oView.setModel(oFModel, "filter");

            var oTModel = new JSONModel();
            oTModel.setData([]);
            oView.setModel(oTModel, "table");

            //this.onFilterSearch();

            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteOrdemLista").attachMatched(this._onRouteMatchedList, this);
        },

        onFilterSearch: function () {
            var oView = this.getView();
            var oModel = this.getOwnerComponent().getModel();
            var oTable = oView.byId("table1");
            var oFModel = oView.getModel("filter");
            var oTModel = oView.getModel("table");
            var oFData = oFModel.getData();
            var oFilter = null;
            var aParams = [];

            // aplicando filtros
            var aSorter = [];
            var aFilters = [];

            if (oFData.OrdemId != '') {
                oFilter = new Filter({
                    path: 'OrdemId',
                    operator: FilterOperator.EQ,
                    value1: oFData.OrdemId
                });
                aFilters.push(oFilter);
            }

            if (oFData.ClienteId != '') {
                oFilter = new Filter({
                    path: 'ClienteId',
                    operator: FilterOperator.EQ,
                    value1: oFData.ClienteId
                });
                aFilters.push(oFilter);
            }

            var bDescending = false;
            if (oFData.OrdenacaoTipo == "DESC") {
                bDescending = true;
            }
            if (oFData.OrdenacaoCampo != '') {
                var oSort = new Sorter(oFData.OrdenacaoCampo, bDescending);
                aSorter.push(oSort);
            }

            // limite, offset
            aParams.push("$top=" + oFData.Limite);
            aParams.push("$skip=" + oFData.Ignorar);

            // executando filtro
            oView.setBusy(true);
            oModel.read("/OVCabSet", {
                sorters: aSorter,
                filters: aFilters,
                urlParameters: aParams,

                success: function (oData2, oResponse) {
                    oView.setBusy(false);
                    oTModel.setData(oData2.results);
                },
                error: function (oError) {
                    oView.setBusy(false);
                    MessageToast.show("Erro");
                }
            });
        },

        onNew: function (oEvent) {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteFormularioCadastro");
        },

        onEdit: function (oEvent) {
            var oSource = oEvent.getSource();
            var sOrdemId = oSource.data("OrdemId");

            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteFormularioAtualizacao", { OrdemId: sOrdemId });
        },

        _onRouteMatchedList: function (oEvent) {
            this.onFilterSearch();
        },

		onFilterReset: function(oEvent) {
			
		}
    });
});