sap.ui.define([
    "zovfrontend/controller/BaseController",
    "zovfrontend/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast"
], (
    Controller,
    formatter,
    JSONModel,
    UIComponent,
    Filter,
    FilterOperator,
    Sorter,
    MessageToast) => {
    "use strict";

    return Controller.extend("zovfrontend.controller.OrdemLista", {

        formatter: formatter,
        oDialogMessageList: null,
        aUpdateStatusQueue: [],
        aUpdateStatusMessages: [],

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

        onDelete: function (oEvent) {
            var oSource = oEvent.getSource();
            var sOrdemId = oSource.data("OrdemId");
            var that = this;

            this.onDeleteOrder(sOrdemId, function (sStatus) {
                if (sStatus == "S") {
                    that.onFilterSearch();
                }
            });
        },

        _onRouteMatchedList: function (oEvent) {
            this.onFilterSearch();
        },

        onFilterReset: function (oEvent) {

        },

        onAtualizarStatus: function (sStatus) {
            var that = this;
            var oView = this.getView();
            var oTable = oView.byId("table1");
            var aData = oView.getModel("table").getData();

            var aIndex = oTable.getSelectedIndices();
            if (aIndex.length == 0) {
                MessageToast.show("Marque ao menos 1 índice");
                return;
            }

            this.aUpdateStatusQueue = [];
            this.aUpdateStatusMessages = [];

            for (var i in aIndex) {
                try {
                    var iIndex = aIndex[i];
                    var sOrdemId = aData[iIndex].OrdemId;
                    this.aUpdateStatusQueue.push({
                        OrdemId: sOrdemId,
                        Status: sStatus
                    });
                } catch (error) {
                    console.log(error);
                }
            }

            this.runUpdateStatusQueue();
        },

        runUpdateStatusQueue: function () {

            var that = this;
            var oQueue = this.aUpdateStatusQueue.pop();

            if (oQueue == undefined) {
                this.getView().setBusy(false);
                this.onOpenMessageListDialog();
                this.onFilterSearch();
                return;
            }

            var oModel = this.getOwnerComponent().getModel();

            this.getView().setBusy(true);
            oModel.callFunction("/ZJV_FI_ATUALIZA_STATUS", {
                method: 'GET',
                urlParameters: {
                    ID_ORDEMID: oQueue.OrdemId,
                    ID_STATUS: oQueue.Status
                },
                success: function (oData, oResponse) {
                    for (var i in oData.results) {
                        that.aUpdateStatusMessages.push(oData.results[i]);
                    }
                    that.runUpdateStatusQueue();
                },
                error: function (oError) {
                    try {
                        var oMessage = oError.responseText;
                        that.aUpdateStatusMessages.push({
                            "Tipo": "E",
                            "Mensagem": "Erro ao atualizar ordem " + oQueue.OrdemId + ": " + oMessage
                        });
                    } catch (error) {
                        that.aUpdateStatusMessages.push({
                            "Tipo": "E",
                            "Mensagem": "Erro ao atualizar ordem " + oQueue.OrdemId
                        });
                    }
                    that.runUpdateStatusQueue();
                }
            });
        },

         onOpenMessageListDialog: function(){
                var that  = this;
                var sName = "zovfrontend.view.MessageList";

                var oModel = new JSONModel(this.aUpdateStatusMessages);
                this.getView().setModel(oModel,"messageList");
                
                if(!this.oDialogMessageList){
                    this.loadFragment({
                        name: sName
                    }).then(function(oDialog2) {
                        that.oDialogMessageList = oDialog2;
                        that.oDialogMessageList.open();
                    }.bind(this));
                }else{
                    this.oDialogMessageList.open();
                }
            },

            onCloseMessageListDialog: function(){
                this.byId("MessageListDialog").close();
            }

    });
});