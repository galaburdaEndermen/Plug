"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };
        const ngServiceDecorator = require("core/ngService");

        var callback = function (mutationsList, observer) {

            let t1 = $scope.viewStats;
            let t2 = $scope;

            let t3 = Services;




            // let divs = document.getElementsByClassName("dialog ProcessedOrders_ReturnsView")?.[0];
            let divs = document.getElementsByTagName("div");

            for (var form of divs) {
                if (form.className.includes("ProcessedOrders_ReturnsView")) {
                    let inputs = form.getElementsByTagName("input");
                    let customer = '';
                    let source = '';
                    let orderDate = '';
                    let orderTotal = '';
                    let subSource = '';
                    let processedDate = '';
                    for (var input of inputs) {
                        if (input.getAttribute("lw-tst") === "label_Customer") {
                            customer = input.value;
                        }
                        if (input.getAttribute("lw-tst") === "label_Source") {
                            source = input.value;
                        }
                        if (input.getAttribute("lw-tst") === "label_OrderDate") {
                            orderDate = input.value;
                        }
                        if (input.getAttribute("lw-tst") === "label_OrderTotal") {
                            orderTotal = input.value;
                        }
                        if (input.getAttribute("lw-tst") === "label_Subsource") {
                            subSource = input.value;
                        }
                        if (input.getAttribute("lw-tst") === "label_ProcessedDate") {
                            processedDate = input.value;
                        }
                    }
                    let sas123 = 'sas';
                }
            }

            // if (tab.getAttribute("lw-tst") === "tab_Resend") 

            let script = `
            select  
            pkOrderId as Id,
            DATEADD(MINUTE, DATEDIFF(MINUTE, 0, dReceievedDate), 0) as OrderDate,
            DATEADD(MINUTE, DATEDIFF(MINUTE, 0, dProcessedOn), 0) as ProcessedOn

            from [order]
            where 
            source = 'DIRECT' 
            and subSource = ''
            and dProcessedOn is not null 
            and FORMAT(fTotalCharge, 'N2') = '710.48'
            and [order].cFullName like '%test test boy%'
            `;
            let parameters = [];
            Services.executeRequestBySession({}, `/api/Dashboards/ExecuteCustomScriptWithParameters`, { script, parameters }, event => {
                if (event.result.IsError) {
                    let lal = event.result;
                }
                else {
                    console.log(event.result.Results);
                    console.log(new Date('07 Jun 2022 10:21').toISOString());
                    // console.log(new Date('07 Jun 2022 10:21'));
                    // console.log(Date.parse('07 Jun 2022 10:21'));
                    // console.log(Date.parse('07 Jun 2022 10:21').toISOString());
                }
            });


        }

        const observer = new MutationObserver(callback);




        setTimeout(function () {
            const targetNode = document.getElementsByTagName("body")[0];
            observer.observe(targetNode, config);
        }, 2000);
    })

    function executeCustomScriptWithParameters(script, parameters) {

        return new Promise((resolve, reject) => {
            Services.executeRequestBySession({}, `/api/Dashboards/ExecuteCustomScriptWithParameters`, { script, parameters }, event => {
                if (!commonHelper.isNullOrEmpty(event.error)) {
                    return reject("ExecuteCustomScriptWithParameters: " + event.error.errorMessage);
                }
                else if (event.result.IsError) {
                    return reject("ExecuteCustomScriptWithParameters: " + event.result.ErrorMessage);
                }
                return resolve(event.result.Results);
            });
        });
    }
});