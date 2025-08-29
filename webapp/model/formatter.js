sap.ui.define([
    "sap/ui/core/format/NumberFormat"
], 
function (NumberFormat) {
    "use strict";

    return {
        formatPrice: function(sValue) {
            if (!sValue) return "";

            const oFormatOptions = {
                groupingEnabled: true,
                groupingSeparator: '.',
                decimalSeparator: ',',
                decimals: 2,
                showMeasure: false
            };
            const oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions);
            return oFloatFormat.format(parseFloat(sValue));
        },

        formatCPF: function(sValue) {
            if (!sValue) return "";
            sValue = sValue.replace(/\D/g, '');
            if (sValue.length !== 11) return sValue; 

            return (
                sValue.slice(0, 3) + "." +
                sValue.slice(3, 6) + "." +
                sValue.slice(6, 9) + "-" +
                sValue.slice(9, 11)
            );
        },

        formatStatus: function(sValue) {
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            return oResourceBundle.getText("Status" + sValue);
        }
    };
});
