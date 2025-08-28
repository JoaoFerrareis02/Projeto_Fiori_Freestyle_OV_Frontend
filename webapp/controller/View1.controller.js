
sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], (Controller,
	MessageToast) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        onInit: function () {
        },

        onCreateOVCab: function (oEvent) {
            var oData = {
                ClienteId: 1,
                TotalItens: '100.00',
                TotalFrete: '100.00',
                TotalOrdem: '200.00',
                Status: 'N',
            };
            this.create(oData);
        },

        onCreateDeepOVCab: function (oEvent) {
            var oData = {
                ClienteId: 1,
                TotalItens: '100.00',
                TotalFrete: '100.00',
                TotalOrdem: '200.00',
                Status: 'N',
                toOVItem: [
                    {
                        ItemId: 1,
                        Material: '100',
                        Descricao: 'Teclado',
                        Quantidade: 1,
                        PrecoUni: '80.00',
                        PrecoTot: '80.00'
                    },
                    {
                        ItemId: 2,
                        Material: '200',
                        Descricao: 'Mouse',
                        Quantidade: 1,
                        PrecoUni: '20.00',
                        PrecoTot: '20.00'
                    }
                ]
            };
            this.create(oData);
        },

        create: function(oData) {
            var that = this;
            var oModel = this.getOwnerComponent().getModel();

            this.getView().setBusy(true);
            oModel.create("/OVCabSet", oData, {
                success: function(oData2, oResponse){
                    that.getView().setBusy(false);
                    console.log(oData2);
                    console.log(oResponse);
                    if (oResponse.statusCode == 201) {
                        that.getView().byId("lastOrderId").setValue(oData2.OrdemId);
                        that.getView().byId("textarea1").setValue(JSON.stringify(oData2));

                        MessageToast.show("Cadastrado com Sucesso");
                    } else {
                        MessageToast.show("Erro no cadastro");
                    }
                },
                error: function(oError){
                    that.getView().setBusy(false);
                    console.log(oError);
                    var obj = JSON.parse(oError.responseText);
                    MessageToast.show(obj.error.message.value);
                }
            });
        },

        onReadOVCab: function (oEvent) {
            var iOrdemId = this.getView().byId("lastOrderId").getValue();
            if (iOrdemId == 0) {
                MessageToast.show("Crie um cabeçalho de ordem primeiro")
                return;
            }
            this.read(iOrdemId);
        },

		read: function(iOrdemId) {
			var that = this;
            var oModel = this.getOwnerComponent().getModel();

            this.getView().setBusy(true);
            oModel.read(`/OVCabSet(${iOrdemId})`, {
                success: function(oData2, oResponse){
                    that.getView().setBusy(false);
                    console.log(oData2);
                    console.log(oResponse);
                    MessageToast.show("Leitura Realizada");
                },
                error: function(oError){
                    that.getView().setBusy(false);
                    console.log(oError);
                    var oObj = JSON.parse(oError.responseText);
                    MessageToast.show(oObj.error.message.value);
                }
            });
		},

        onUpdateOVCab: function (oEvent) {
            var iOrdemId = this.getView().byId("lastOrderId").getValue();
            if (iOrdemId == 0) {
                MessageToast.show("Crie um cabeçalho de ordem primeiro")
                return;
            }
            var oData = {
                ClienteId: 1,
                TotalItens: '100.00',
                TotalFrete: '100.00',
                TotalOrdem: '200.00',
                Status: 'S',
            };
            this.update(iOrdemId, oData);
        },

		update: function(iOrdemId, oData) {
			var that = this;
            var oModel = this.getOwnerComponent().getModel();

            this.getView().setBusy(true);
            oModel.update(`/OVCabSet(${iOrdemId})`, oData, {
                success: function(oData2, oResponse){
                    that.getView().setBusy(false);
                    that.getView().byId("textarea1").setValue(JSON.stringify(oData2));
                    console.log(oData2);
                    console.log(oResponse);
                    if (oResponse.statusCode == 200) {
                        MessageToast.show("Atualizado com sucesso");
                    } else {
                        MessageToast.show("Erro em atualizar");
                    }
                },
                error: function(oError){
                    that.getView().setBusy(false);
                    console.log(oError);
                    var obj = JSON.parse(oError.responseText);
                    MessageToast.show(obj.error.message.value);
                }
            });
		},

        onDeleteOVCab: function (oEvent) {
            var iOrdemId = this.getView().byId("lastOrderId").getValue();
            if (iOrdemId == 0) {
                MessageToast.show("Crie um cabeçalho de ordem primeiro")
                return;
            }
            this.remove(iOrdemId);
        },

        remove: function(iOrdemId) {
            var that = this;
            var oModel = this.getOwnerComponent().getModel();

            this.getView().setBusy(true);
            oModel.remove(`/OVCabSet(${iOrdemId})`, {
                success: function(oData2, oResponse){
                    that.getView().setBusy(false);
                    console.log(oData2);
                    console.log(oResponse);
                    if (oResponse.statusCode == 204) {
                        MessageToast.show("Deletado com sucesso");
                    } else {
                        MessageToast.show("Erro em deletar");
                    }
                },
                error: function(oError){
                    that.getView().setBusy(false);
                    console.log(oError);
                    var obj = JSON.parse(oError.responseText);
                    MessageToast.show(obj.error.message.value);
                }
            });
		}

    });
});