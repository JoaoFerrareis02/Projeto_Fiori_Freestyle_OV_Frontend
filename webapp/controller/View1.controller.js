sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,
	MessageToast) => {
    "use strict";
    
    return Controller.extend("zov.controller.View1", {
        onInit() {
            //alert("onInit");
        },

        /**
         * @override
         * @returns {void|undefined}
         */
        onBeforeRendering: function () {
            //alert("onBeforeRendering");
        },

        /**
         * @override
         * @returns {void|undefined}
         */
        onAfterRendering: function () {
            //alert("onAfterRendering");
        },

        /**
         * @override
         * @returns {void|undefined}
         */
        onExit: function () {
            //alert("onExit");
        },

        onCalcular: function () {
            var oView = this.getView();
            var iB1 = parseInt(oView.byId("b1").getValue());
            var iB2 = parseInt(oView.byId("b2").getValue());
            var iB3 = parseInt(oView.byId("b3").getValue());
            var iB4 = parseInt(oView.byId("b4").getValue());
            var fResultado = 0;
            
            fResultado = (iB1 + iB2 + iB3 + iB4) / 4;

            oView.byId("resultado").setValue(fResultado);

            MessageToast.show(`Resultado = ${fResultado}`)

        }

    });
});