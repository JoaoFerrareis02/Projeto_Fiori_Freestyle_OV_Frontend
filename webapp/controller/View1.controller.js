
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "zov/model/formatter"
], (Controller,
	JSONModel,
	formatter) => {
    "use strict";

    return Controller.extend("zov.controller.View1", {
        formatter: formatter,
        onInit() {
            const oView = this.getView();
            const oModel = new JSONModel();

            oModel.setData({
                "DataCriacao": new Date(),
                "Preco": 1520.36,
                "Moeda": "BRL",
                "Status": "N",
                "CPF": "14231438765"
            });

            oView.setModel(oModel, "dados");

        },

        onChangePrice(oEvent) {
            const _oInput = oEvent.getSource();
            let val = _oInput.getValue();
            val = val.replace(/[^\d]/g, '');
            if (val == '') {
                _oInput.setValue(val);
                return;
            }
            val = val.replace(/^0+/, '');
            let lenght = val.length;
            if (lenght == 1) {
                val = '0,0' + val;
            } else if (lenght == 2) {
                val = '0,' + val;
            } else if (lenght > 2) {
                val = val.slice(0, lenght - 2) + '.' + val.slice(-2);
                val = formatter.formatPrice(val);
            } else {
                val = '';
            }
            _oInput.setValue(val);
        }

    });
});