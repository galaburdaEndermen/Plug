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

            let script = "select CAST(CONVERT(CHAR(16), dReceievedDate,20) AS datetime) from [order] where source = 'DIRECT' and subSource = 'US DEV Shopify' and CAST(CONVERT(CHAR(16), dReceievedDate,20) AS datetime) = CAST('07 Jun 2022 15:04' AS DATETIME)";
            let parameters = [];
            Services.executeRequestBySession({}, `/api/Dashboards/ExecuteCustomScriptWithParameters`, { script, parameters }, event => {
                if (event.result.IsError) {
                    let lal = event.result;
                }
                else {
                    let kek = event.result.Results;
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