"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };
        const ngServiceDecorator = require("core/ngService");

        var callback = function (mutationsList, observer) {

            let t1 = $scope.viewStats;
            let t2 = $scope;

            let t3 = Services;

            let script = "select top 100 * from [Order]";
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