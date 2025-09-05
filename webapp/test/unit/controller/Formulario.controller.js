/*global QUnit*/
sap.ui.define([
	"zovfrontend/controller/Formulario.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Formulario Controller");

	QUnit.test("Testando o método createEmptyOrderObject", (assert) => {
		var oAppController = new Controller();
		var oOrder = oAppController.createEmptyOrderObject();
		assert.strictEqual(typeof (oOrder), "object", "Criação de objeto da ordem OK");
	});

	QUnit.test("Testando o método getOrderObject", (assert) => {
		var oAppController = new Controller();

		oAppController.getView = () => {
			return {
				getModel: () => {
					return {
						getData: () => {
							return {
								OrdemId: 0,
								DataCriacao: null,
								ClienteId: "",
								TotalItens: 0.0,
								TotalFrete: 10.50,
								TotalOrdem: 0.0,
								Status: "N",
								toOVItem: [
									{
										ItemId: 1,
										Material: "1",
										Descricao: "Teste",
										Quantidade: 2,
										PrecoUni: 10,
										PrecoTot: 20
									}
								]
							};
						}
					}
				}
			}
		};

		assert.strictEqual(oAppController.getOrderObject().TotalOrdem, 30.5, "getOrderObject OK");

	});

});
