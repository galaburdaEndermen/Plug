"use strict";

define(function (require) {
    $(document).ready(function ($scope) {

        const placeholderManager = require("core/placeholderManager");
        const ngComponent = require("core/ngComponent");

        const macroService = new Services.MacroService(self);

        var obj = { applicationName: 'Print Invoices', macroName: 'Print_Invoices_Macro', orderIds: ["b2a6554a-db14-43cf-a2f0-8ea5030c0f01", "fbce3128-5961-440a-bf2f-9bba54354fc4", "5f514423-be6a-48aa-8eba-d0b5e9ecfa71"] };
        macroService.Run(obj, function (data) {
            if ((data.error == null) && (data.result != null) && (data.result.length != 0)) {
                var orders = data.result;

                $scope.formInvoice(orders);
                //Finally, create a file.
                pdfMake.createPdf(docDefinition).open();
            } else {
                alert('Errors...');
            }
        });

        const config = { childList: true, subtree: true };

        var callback = function (mutationsList, observer) {
            let allDivs = document.getElementsByTagName("div");
            for (var div of allDivs) {
                if (div.getAttribute("ng-controller") === "OpenOrders_SplitOrderView") {
                    let AllButtons = document.getElementsByTagName("button");
                    for (var button of AllButtons) {
                        if (button.innerHTML.toLowerCase().includes("Auto Split".toLowerCase())) {
                            button.disabled = true;
                            break;
                        }
                    }
                    for (var button of AllButtons) {
                        if (button.innerHTML.toLowerCase().includes("One in each order".toLowerCase())) {
                            button.disabled = true;
                            break;
                        }
                    }
                    let AllInputs = document.getElementsByTagName("input");
                    for (var input of AllInputs) {
                        input.disabled = true;
                    }
                }
            }
        };

        // var style = document.createElement('style');
        // style.innerHTML = '.selectInvalid { color: #b94a48!important; border-color: #b94a48!important; }';
        // document.getElementsByTagName('head')[0].appendChild(style);

        const observer = new MutationObserver(callback);

        setTimeout(function () {
            const targetNode = document.getElementsByTagName("body")[0];
            observer.observe(targetNode, config);
        }, 2000);
    });

});