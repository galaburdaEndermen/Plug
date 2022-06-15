"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };
        const ngServiceDecorator = require("core/ngService");

        var callback = function (mutationsList, observer) {

            let t1 = $scope.viewStats;
            let t2 = $scope;

            let t3 = Services;




            // // let divs = document.getElementsByClassName("dialog ProcessedOrders_ReturnsView")?.[0];
            // let divs = document.getElementsByTagName("div");

            // for (var form of divs) {
            //     if (form.className.includes("ProcessedOrders_ReturnsView")) {
            //         let plus = form.getElementsByClassName("fa fa-plus-square-o fa-lg  slick-icon-row-toggle")?.[0];
            //         if (plus) {
            //             plus.click();

            //             var cell = document.getElementsByClassName("slick-cell l5 r5")?.[0];
            //             if (cell) {
            //                 var inner = cell.getElementsByTagName("span")?.[0];
            //                 let reference = inner.innerHTML;
            //             }
            //         }
            //     }
            // }


            // if (form) {

            // }

            // new Date(year, month, day);

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
                    let kek = event.result.Results;
                    console.log(kek);
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