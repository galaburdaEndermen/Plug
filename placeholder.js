"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };
        const ngServiceDecorator = require("core/ngService");

        let customer = '';
        let source = '';
        let orderDate = '';
        let orderTotal = '';
        let subSource = '';
        let refundHeader = '';
        let processedDate = '';
        let order = undefined;

        var callback = function (mutationsList, observer) {
            if (!(customer && source && orderDate && orderTotal && subSource && processedDate)) {
                let divs = document.getElementsByTagName("div");
                for (var form of divs) {
                    if (form.className.includes("ProcessedOrders_RefundsView")) {
                        let inputs = form.getElementsByTagName("input");
                        let h3s = form.getElementsByTagName("h3");
                        for (var input of inputs) {
                            if (input.getAttribute("lw-tst") === "label_Customer") {
                                customer = input.value;
                            }
                            if (input.getAttribute("lw-tst") === "label_Source") {
                                source = input.value;
                            }
                            if (input.getAttribute("lw-tst") === "label_OrderDate") {
                                orderDate = new Date(input.value).toISOString()
                            }
                            if (input.getAttribute("lw-tst") === "label_OrderTotal") {
                                orderTotal = input.value.split(' ')[0];
                            }
                            if (input.getAttribute("lw-tst") === "label_Subsource") {
                                subSource = input.value;
                            }
                            if (input.getAttribute("lw-tst") === "label_ProcessedDate") {
                                processedDate = new Date(input.value).toISOString()
                            }
                            if (customer && source && orderDate && orderTotal && subSource && processedDate) {
                                break;
                            }
                        }
                        for (var h3 of h3s) {
                            if (h3.innerHTML.includes("Refunds - Refund #")) {
                                refundHeader = h3.innerHTML.replace("Refunds - Refund #", "").trim();
                                break;
                            }
                        }

                        if (customer && source && orderDate && orderTotal && subSource && processedDate) {
                            let script = `
                            select  
                            pkOrderId as Id,
                            DATEADD(MINUTE, DATEDIFF(MINUTE, 0, dReceievedDate), 0) as OrderDate,
                            DATEADD(MINUTE, DATEDIFF(MINUTE, 0, dProcessedOn), 0) as ProcessedOn,
                            PropertyName,
                            PropertyValue
    
                            from [order]
                            left join Order_ExtendedProperties on pkOrderId = fkOrderId and PropertyName like 'VertexCall_100245'
                            where 
                            source = '${source}' 
                            and subSource = '${subSource}' 
                            and dProcessedOn is not null 
                            and FORMAT(fTotalCharge, 'N2') = '${orderTotal}'
                            and [order].cFullName like '%${customer}%'
                            `;
                            let parameters = [];
                            Services.executeRequestBySession({}, `/api/Dashboards/ExecuteCustomScriptWithParameters`, { script, parameters }, event => {
                                if (event.result.IsError) {
                                    console.log("Error in refunds placeholder");
                                    console.log(event.result);
                                }
                                else {
                                    order = event.result.Results.find(r => new Date(r.OrderDate).toISOString() === orderDate && new Date(r.ProcessedOn).toISOString() === processedDate);
                                }
                            });
                        }
                        break;
                    }
                }
            }
            if (order) {
                let buttons = document.getElementsByTagName("button");
                if (order.PropertyName && (order.PropertyValue.includes("N442.000"))) {
                    for (var button of buttons) {
                        if (button.getAttribute("lw-tst") === "removeRefund") {
                            button.disabled = true;
                        }
                    }
                    let inputs2 = document.getElementsByTagName("input");
                    for (var input2 of inputs2) {
                        if (input2.getAttribute("ng-model") === "refund.Amount") {
                            input2.disabled = true;
                        }
                    }

                }
                else {
                    for (var button of buttons) {
                        if (button.getAttribute("lw-tst") === "btn_Action") {
                            button.disabled = true;
                        }
                    }
                }
            }
        }

        const observer = new MutationObserver(callback);
        setTimeout(function () {
            const targetNode = document.getElementsByTagName("body")[0];
            observer.observe(targetNode, config);
        }, 2000);
    })
});

// define(function (require) {
//     const placeholderManager = require("core/placeholderManager");

//     var docDefinition;
//     const TemplateName = "Passport";

//     var placeHolder = function ($scope, $element, controlService) {

//         //const _this = this;
//         this.getItems = () => {
//             var items = [{
//                 text: "Print Labels",  // Button name
//                 key: "placeholderPrintLabelsButtond",  // Button id (unique)
//                 icon: "fa fa-print",  // Button icon
//                 content: {
//                     moduleName: "placeholderPrintLabelsButtonTemplate",
//                     controlName: "placeholderPrintLabelsButtonTemplate"
//                 }
//             }];

//             return items;
//         };

//         this.isEnabled = (itemKey) => {
//             return true;
//         };

//         this.onClick = () => {
//             console.log("TEST BUTTON")
//             console.log($scope);
//             console.log($element);
//         };






//         const config = { childList: true, subtree: true };
//         const ngServiceDecorator = require("core/ngService");

//         var callback = function (mutationsList, observer) {
//             let t3 = Services;
//             let t1 = $scope;
//             console.log(t1);
//             let t2 = $scope.viewStats;


//             let divs = document.getElementsByTagName("div");
//             let buttons = document.getElementsByTagName("button");
//             for (var button of buttons) {
//                 if (button.innerHTML.includes("Action Credit Note")) {
//                     // placeholderPrintLabelsButtond
//                     // button.remove();
//                 }
//             }
//             for (var form of divs) {
//                 if (form.className.includes("ProcessedOrders_RefundsView")) {
//                     let inputs = form.getElementsByTagName("input");
//                     let customer = '';
//                     let source = '';
//                     let orderDate = '';
//                     let orderTotal = '';
//                     let subSource = '';
//                     let processedDate = '';
//                     for (var input of inputs) {
//                         if (input.getAttribute("lw-tst") === "label_Customer") {
//                             customer = input.value;
//                         }
//                         if (input.getAttribute("lw-tst") === "label_Source") {
//                             source = input.value;
//                         }
//                         if (input.getAttribute("lw-tst") === "label_OrderDate") {
//                             orderDate = new Date(input.value).toISOString()
//                         }
//                         if (input.getAttribute("lw-tst") === "label_OrderTotal") {
//                             orderTotal = input.value.split(' ')[0];
//                         }
//                         if (input.getAttribute("lw-tst") === "label_Subsource") {
//                             subSource = input.value;
//                         }
//                         if (input.getAttribute("lw-tst") === "label_ProcessedDate") {
//                             processedDate = new Date(input.value).toISOString()
//                         }
//                     }
//                     if (orderTotal) {
//                         let script = `
//                         select
//                         pkOrderId as Id,
//                         DATEADD(MINUTE, DATEDIFF(MINUTE, 0, dReceievedDate), 0) as OrderDate,
//                         DATEADD(MINUTE, DATEDIFF(MINUTE, 0, dProcessedOn), 0) as ProcessedOn,
//                         PropertyName,
//                         PropertyValue

//                         from [order]
//                         left join Order_ExtendedProperties on pkOrderId = fkOrderId and PropertyName like 'VertexCall_100245'
//                         where
//                         source = '${source}'
//                         and subSource = '${subSource}'
//                         and dProcessedOn is not null
//                         and FORMAT(fTotalCharge, 'N2') = '${orderTotal}'
//                         and [order].cFullName like '%${customer}%'
//                         `;
//                         let parameters = [];
//                         Services.executeRequestBySession({}, `/api/Dashboards/ExecuteCustomScriptWithParameters`, { script, parameters }, event => {
//                             if (event.result.IsError) {
//                                 let lal = event.result;
//                             }
//                             else {
//                                 console.log(event.result.Results);

//                                 let order = event.result.Results.find(r => r.OrderDate === orderDate && r.ProcessedOn === processedDate);
//                                 if (order) {
//                                     let orderId = order.Id;
//                                 }
//                             }
//                         });
//                     }
//                 }
//             }
//         }

//         const observer = new MutationObserver(callback);
//         setTimeout(function () {
//             const targetNode = document.getElementsByTagName("body")[0];
//             observer.observe(targetNode, config);
//         }, 2000);


//     };

//     placeholderManager.register("ProcessedOrders_Refunds_BottomButtons", placeHolder);

// });
