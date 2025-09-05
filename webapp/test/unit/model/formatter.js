sap.ui.define([
    "zovfrontend/model/formatter"
], function (
	formatter
) {
    "use strict";

    QUnit.module("formatter");

    QUnit.test("Testando a formatação de CPF", (assert) => {
        var sCPF = "14231538745";
        var sValue = formatter.formatCPF(sCPF);
        assert.strictEqual(sValue, "142.315.387-45", "Formatação de CPF OK");
    });

    QUnit.test("Testando a formatação de CPF com 10 digitos", (assert) => {
        var sCPF = "1423153874";
        var sValue = formatter.formatCPF(sCPF);
        assert.strictEqual(sValue, "142.315.387-4", "Formatação de CPF 10 dígitos OK");
    });

    QUnit.module("formatter2");

    QUnit.test("Testando a formatação de CPF com letras", (assert) => {
        var sCPF = "ABC";
        var sValue = formatter.formatCPF(sCPF);
        assert.ok(sValue == "");
    });
});