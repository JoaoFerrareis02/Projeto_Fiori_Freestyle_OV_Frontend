sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"../model/formatter",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/BindingMode",
	"sap/ui/model/json/JSONModel"
],
	function (Controller,
		MessageToast,
		formatter,
		History,
		UIComponent,
		BindingMode,
		JSONModel) {
		"use strict";

		return Controller.extend("zovfrontend.controller.Formulario", {
			formatter: formatter,

			_formMode: "I",

			onInit: function () {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.getRoute("RouteFormularioCadastro").attachMatched(this._onRouteMatchedNew, this);
				oRouter.getRoute("RouteFormularioAtualizacao").attachMatched(this._onRouteMatcheEdit, this);
			},

			liveChangeItemQuantity: function (oEvent) {
				var _oInput = oEvent.getSource();
				var val = _oInput.getValue();
				val = val.replace(/[^\d]/g, '');
				_oInput.setValue(val);

				this._recalcOrder();
			},

			liveChangePrice: function (oEvent) {
				var _oInput = oEvent.getSource();
				var val = _oInput.getValue();
				val = val.replace(/[^\d]/g, '');

				if (val == "") {
					_oInput.setValue(val);
					return;
				}

				// removendo zero a esquerda
				val = val.replace(/^0+/, '');

				var length = val.length;
				if (length == 1) {
					val = "0.0" + val;
				} else if (length == 2) {
					val = "0." + val;
				} else if (length > 2) {
					val = val.slice(0, length - 2) + "." + val.slice(-2);
				} else {
					val = "";
				}

				// GAMBIARRA para atualizar o model usando formatação e liveUpdate ao mesmo tempo
				// caso encontre uma solução melhor, faço o ajuste no futuro

				//_oInput.setValue(val);

				var oView = this.getView();
				var oModel = oView.getModel();
				var oData = oModel.getData();
				var oContext = _oInput.getBindingContext();
				var sInputPath = _oInput.mBindingInfos.value.binding.sPath;
				//debugger;

				if (sInputPath == "/TotalFrete") {
					// TotalFrete
					oData.TotalFrete = parseFloat(val);
				} else {
					//var oObject = oContext.getObject();
					var sPath = oContext.getPath();
					var aPath = sPath.split("/");
					var iIndex = [];

					// PrecoUni
					if (sInputPath == "PrecoUni") {
						iIndex = parseInt(aPath[2]);
						oData.toOVItem[iIndex].PrecoUni = parseFloat(val);
					}
				}

				this._recalcOrder();
			},

			_recalcOrder: function () {
				var oView = this.getView();
				var oModel = oView.getModel();
				var oOrdem = this._getOrderObject();
				oModel.setData(oOrdem);
				oView.setModel(oModel);
			},

			onNewItem: function () {
				var oView = this.getView();
				var oModel = oView.getModel();
				var oOrdem = oModel.getData();
				var aToOVItem = oOrdem.toOVItem;

				var lastItemId = 0;
				for (var i in aToOVItem) {
					if (aToOVItem[i].ItemId > lastItemId) {
						lastItemId = aToOVItem[i].ItemId;
					}
				}

				// clonando objeto
				var item = this._createEmptyItem();

				item.ItemId = lastItemId + 1;

				aToOVItem.push(item);
				oOrdem.toOVItem = aToOVItem;

				oModel.setData(oOrdem);
				oView.setModel(oModel);
			},

			onDeleteItem: function (oEvent) {
				var oSource = oEvent.getSource();
				var sItemId = oSource.data("ItemId");

				var oView = this.getView();
				var oModel = oView.getModel();
				var oOrdem = oModel.getData();
				var aToOVItem = oOrdem.toOVItem;

				for (var i in aToOVItem) {
					if (aToOVItem[i].ItemId == sItemId) {
						aToOVItem.splice(i, 1);
						break;
					}
				}

				oOrdem.toOVItem = aToOVItem;
				oModel.setData(oOrdem);
				oView.setModel(oModel);

				this._recalcOrder();
			},

			_getOrderObject: function () {
				var oView = this.getView();
				var oModel = oView.getModel();
				var oOrdem = oModel.getData();

				// cabeçalho
				oOrdem.OrdemId = this._parseInt(oOrdem.OrdemId);
				oOrdem.TotalFrete = this._parsePrice(oOrdem.TotalFrete);

				// itens
				oOrdem.TotalItens = 0;
				for (var i in oOrdem.toOVItem) {
					oOrdem.toOVItem[i].Quantidade = this._parseInt(oOrdem.toOVItem[i].Quantidade);
					oOrdem.toOVItem[i].PrecoUni = this._parsePrice(oOrdem.toOVItem[i].PrecoUni);
					oOrdem.toOVItem[i].PrecoTot = oOrdem.toOVItem[i].Quantidade * oOrdem.toOVItem[i].PrecoUni;

					oOrdem.TotalItens = oOrdem.TotalItens + oOrdem.toOVItem[i].PrecoTot;
				}
				oOrdem.TotalOrdem = oOrdem.TotalItens + oOrdem.TotalFrete;

				return oOrdem;
			},

			_getOrderOData: function () {
				var oOrdem = this._getOrderObject();

				// cabeçalho
				if (oOrdem.OrdemId == "") {
					oOrdem.OrdemId = 0;
				}
				oOrdem.ClienteId = this._parseInt(oOrdem.ClienteId);

				oOrdem.TotalItens = oOrdem.TotalItens.toFixed(2);
				oOrdem.TotalFrete = oOrdem.TotalFrete.toFixed(2);
				oOrdem.TotalOrdem = oOrdem.TotalOrdem.toFixed(2);

				// items
				for (var i in oOrdem.toOVItem) {
					oOrdem.toOVItem[i].PrecoUni = oOrdem.toOVItem[i].PrecoUni.toFixed(2);
					oOrdem.toOVItem[i].PrecoTot = oOrdem.toOVItem[i].PrecoTot.toFixed(2);
				}

				return oOrdem;
			},

			_createEmptyOrderObject: function () {
				var oOrdem = {
					OrdemId: "",
					DataCriacao: null,
					CriadoPor: "",
					ClienteId: "",
					TotalItens: 0.0,
					TotalFrete: 0,
					TotalOrdem: 0.0,
					Status: "",
					toOVItem: []
				};
				return oOrdem;
			},

			_createEmptyItem: function () {
				var oItem = {
					ItemId: 0,
					Material: "",
					Descricao: "",
					Quantidade: "",
					PrecoUni: "",
					PrecoTot: ""
				};
				return oItem;
			},

			onSave: function () {
				var that = this;
				var oView = this.getView();
				var oModel1 = this.getOwnerComponent().getModel();
				var oModel2 = oView.getModel();
				var oOrdem = this._getOrderOData();

				// validações
				var oClienteId = this.getView().byId("OVCab.ClienteId");
				oClienteId.setValueState("None");

				if (oOrdem.ClienteId == 0) {
					oClienteId.setValueState("Error");
					MessageToast.show("Cliente vazio");
					return;
				}

				if (this._formMode == "I") {
					oView.setBusy(true);
					oModel1.create("/OVCabSet", oOrdem, {
						success: function (oData, oResponse) {
							// ajustando itens que voltam dentro do campo results
							oData.toOVItem = oData.toOVItem.results;

							oModel2.setData(oData);
							if (oResponse.statusCode == 201) {
								// bloqueando campos
								oView.byId("OVCab.DataCriacao").setEditable(false);
								oView.byId("OVCab.CriadoPor").setEditable(false);

								MessageToast.show("Ordem cadastrada com sucesso");
							} else {
								MessageToast.show("Erro ao salvar");
							}

							oView.setBusy(false);
						},
						error: function (oResponse) {
							var oError = JSON.parse(oResponse.responseText);
							MessageToast.show(oError.error.message.value);
							oView.setBusy(false);
						}
					}
					);
				} else {
					oView.setBusy(true);
					oModel1.create(`/OVCabSet`, oOrdem, {
						success: function (oData, oResponse) {
							if (oResponse.statusCode == 204 || oResponse.statusCode == 201) {
								MessageToast.show("Ordem atualizada com sucesso");
							}
							oView.setBusy(false);
						},
						error: function (oResponse) {
							var oError = JSON.parse(oResponse.responseText);
							MessageToast.show(oError.error.message.value);
							oView.setBusy(false);
						}
					}
					);
				}

			},

			_onRouteMatchedNew: function (oEvent) {

				this._formMode = "I";

				var oView = this.getView();

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setDefaultBindingMode(BindingMode.TwoWay);
				oModel.setData(this._createEmptyOrderObject());
				oView.setModel(oModel);

				oView.byId("OVCab.DataCriacao").setEditable(true);
				oView.byId("OVCab.CriadoPor").setEditable(true);
				oView.byId("OVCab.ClienteId").setValueState("None");

				this._recalcOrder();
			},

			_onRouteMatcheEdit: function (oEvent) {
				var that = this;
				var oView = this.getView();
				var oArgs = oEvent.getParameter("arguments");
				var sOrdemId = oArgs.OrdemId;
				var oModel = this.getOwnerComponent().getModel();
				var oModel1 = null;

				this._formMode = "U";

				// limpando dados
				oModel1 = new sap.ui.model.json.JSONModel(this._createEmptyOrderObject());
				oModel1.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

				oView.byId("OVCab.DataCriacao").setEditable(false);
				oView.byId("OVCab.CriadoPor").setEditable(false);
				oView.byId("OVCab.ClienteId").setValueState("None");

				oView.setBusy(true);

				// cabeçalho
				oModel.read("/OVCabSet(" + sOrdemId + ")", {
					success: function (oOrdem, oResponse) {
						// items
						oModel.read("/OVCabSet(" + sOrdemId + ")/toOVItem", {
							success: function (oData, oResponse) {
								oOrdem.toOVItem = oData.results;
								oModel1.setData(oOrdem);
								oView.setModel(oModel1);

								that._recalcOrder();
								oView.setBusy(false);
							},
							error: function (oError) {
								var oError = JSON.parse(oResponse.responseText);
								MessageToast.show(oError.error.message.value);
								oView.setBusy(false);
							}
						});
					},
					error: function (oResponse) {
						var oError = JSON.parse(oResponse.responseText);
						MessageToast.show(oError.error.message.value);
						oView.setBusy(false);
					}
				});
			},

			_parseInt: function (sValue) {
				if (sValue == "" || sValue == null || sValue == undefined) {
					return 0;
				}

				sValue = parseInt(sValue);
				if (sValue == null || isNaN(sValue)) {
					sValue = 0;
				}
				return sValue;
			},

			_parsePrice: function (sValue) {
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
					UIComponent.getRouterFor(this).navTo("RouteView1");
				}
			}
		});
	});