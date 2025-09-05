/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Formulario",
	"./pages/OrdemLista"
], function (opaTest) {
	"use strict";

	QUnit.module("Navigation Journey");

	setTimeout(() => {
		opaTest("I should see initial page", (Given, When, Then) => {
			Given.iStartMyApp();
			Then.onTheOrdemListaPage.iShouldSeeThePage();
		});

		opaTest("I should create new order", (Given, When, Then) => {
			When.onTheOrdemListaPage.iPressOnTheNewButton();
			Then.onTheFormularioPage.iShouldSeeThePage();

			When.onTheFormularioPage.iEnterCreateAt("01/01/2000 10:50:00");
			When.onTheFormularioPage.iEnterCreateBy("ABAP");
			When.onTheFormularioPage.iEnterCustomerId(1);
			When.onTheFormularioPage.iEnterTotalFreight("1,50");
			When.onTheFormularioPage.iSelectStatus("N");

			When.onTheFormularioPage.iPressOnTheSaveButton();
			Then.onTheFormularioPage.iShouldSeeTheSuccessMessage();

			When.onTheFormularioPage.iPressOnTheBackButton();
			Then.onTheOrdemListaPage.iShouldSeeThePage();
		});

		opaTest("I should edit order", (Given, When, Then) => {
			When.onTheOrdemListaPage.iSelectSortField("OrdemId");
			When.onTheOrdemListaPage.iSelectSortType("DESC");
			When.onTheOrdemListaPage.iEnterLimit(1);
			When.onTheOrdemListaPage.iPressOnTheFilterButton();
			Then.onTheOrdemListaPage.iShouldSeeTheOnlyOneRegister();
			When.onTheOrdemListaPage.iPressOnTheEditButton();

			Then.onTheFormularioPage.iShouldSeeThePage();
			When.onTheFormularioPage.iEnterCustomerId(2);
			When.onTheFormularioPage.iEnterTotalFreight("20,33");
			When.onTheFormularioPage.iSelectStatus('L');

			When.onTheFormularioPage.iPressOnTheAddItemButton();
			When.onTheFormularioPage.iAddItem(0,'100','TECLADO',1,'1,99');

			When.onTheFormularioPage.iPressOnTheAddItemButton();
			When.onTheFormularioPage.iAddItem(0,'200','MOUSE',1,'2,50');

			When.onTheFormularioPage.iPressOnTheSaveButton();
			Then.onTheFormularioPage.iShouldSeeTheSuccessMessage();
			When.onTheFormularioPage.iPressOnTheBackButton();

			Then.onTheOrdemListaPage.iShouldSeeThePage();
		});

		opaTest("I should delete order", (Given, When, Then) => {
			When.onTheOrdemListaPage.iSelectSortField("OrdemId");
			When.onTheOrdemListaPage.iSelectSortType("DESC");
			When.onTheOrdemListaPage.iEnterLimit(1);
			When.onTheOrdemListaPage.iPressOnTheFilterButton();
			Then.onTheOrdemListaPage.iShouldSeeTheOnlyOneRegister();
			When.onTheOrdemListaPage.iPressOnTheDeleteButton();

			Then.onTheOrdemListaPage.iShouldSeeTheSuccessMessage();
		});

		opaTest("I should finish", (Given, When, Then) => {
			Then.onTheOrdemListaPage.iShouldSeeThePage();
			Then.iTeardownMyApp();
		});
	}, 1);

});
