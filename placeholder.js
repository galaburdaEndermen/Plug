"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };
        const tooltipStyle = '' +
            '<style>' +
            '            /* Tooltip container */' +
            '            .tooltip {' +
            '                position: relative;' +
            '                display: inline-block;' +
            '            }' +
            '' +
            '            /* Tooltip text */' +
            '            .tooltip .tooltiptext {' +
            '                visibility: hidden;' +
            '                width: 300px;' +
            '                background-color: white;' +
            '                color: black;' +
            '                text-align: center;' +
            '                padding: 5px 0;' +
            '                border-radius: 6px;' +
            '                /* Position the tooltip text - see examples below! https://www.w3schools.com/css/css_tooltip.asp*/' +
            '                position: absolute;' +
            '                /* top: -5px; */' +
            '                /* left: 105%; */' +
            '                z-index: 10000;' +
            '            }' +
            '' +
            '            /* Show the tooltip text when you mouse over the tooltip container */' +
            '            .tooltip:hover .tooltiptext {' +
            '                visibility: visible;' +
            '            }' +
            '        </style>' +
            '        <span class="tooltiptext">You can not create this booking as it is outside your return date authorization window.' +
            '            </span>' +
            '';

        const makeDisabled = (element) => {
            element.disabled = true;

            if (!element.innerHTML.includes("Tooltip")) {
                let newE = element.cloneNode(true);
                newE.innerHTML = tooltipStyle + ' ' + newE.innerHTML;
                newE.className += " tooltip";
                newE.style.overflow = "visible";
                element.replaceWith(newE);

                let a = newE;
                let elems = [];
                while (a) {
                    elems.unshift(a);
                    a = a.parentElement;
                }

                for (var elem of elems) {
                    if (elem.style.overflow) {
                        if (elem.style.overflow !== "auto") {
                            // elem.style.overflow = "visible";
                            let sas = "lel";
                        }
                    }
                }
            }

            // var elems = document.body.getElementsByTagName("*");
            // for (var elem of elems) {
            //     if (elem.style.overflow) {
            //         if (elem.style.overflow !== "auto") {
            //             elem.style.overflow = "visible";
            //         }
            //     }
            // }
        }
        const ngServiceDecorator = require("core/ngService");

        let customer = '';
        let source = '';
        let orderDate = '';
        let orderTotal = '';
        let subSource = '';
        let refundHeader = '';
        let processedDate = '';
        let order = undefined;

        const regex = /S-O[0-9]+.[0-9]+-N[0-9]+.[0-9]+/gmi;

        var callback = function (mutationsList, observer) {
            let divs = document.getElementsByTagName("div");
            let found = false;
            for (var form of divs) {
                if (form.className.includes("ProcessedOrders_RefundsView")) {
                    found = true;
                    let inputs = form.getElementsByTagName("input");
                    let h3s = form.getElementsByTagName("h3");
                    for (var input of inputs) {
                        if (input.getAttribute("lw-tst") === "label_Customer") {
                            customer = input.value;
                            continue;
                        }
                        if (input.getAttribute("lw-tst") === "label_Source") {
                            source = input.value;
                            continue;
                        }
                        if (input.getAttribute("lw-tst") === "label_OrderDate") {
                            orderDate = new Date(input.value).toISOString();
                            continue;
                        }
                        if (input.getAttribute("lw-tst") === "label_OrderTotal") {
                            orderTotal = input.value.split(' ')[0];
                            continue;
                        }
                        if (input.getAttribute("lw-tst") === "label_Subsource") {
                            subSource = input.value;
                            continue;
                        }
                        if (input.getAttribute("lw-tst") === "label_ProcessedDate") {
                            if (input.value) {
                                processedDate = new Date(input.value).toISOString();
                            }
                        }
                    }
                    for (var h3 of h3s) {
                        if (h3.innerHTML.includes("Refunds - Refund #")) {
                            refundHeader = h3.innerHTML.replace("Refunds - Refund #", "").trim();
                            break;
                        }
                        else {
                            refundHeader = '';
                        }
                    }


                    if (!refundHeader) {
                        customer = '';
                        source = '';
                        orderDate = '';
                        orderTotal = '';
                        subSource = '';
                        refundHeader = '';
                        processedDate = '';
                        order = undefined;
                        break;
                    }

                    if (orderDate && orderTotal && !order) {
                        let script = `
                            select  
                            pkOrderId as Id,
                            DATEADD(MINUTE, DATEDIFF(MINUTE, 0, dReceievedDate), 0) as OrderDate,
                            DATEADD(MINUTE, DATEDIFF(MINUTE, 0, dProcessedOn), 0) as ProcessedOn,
                            PropertyName,
                            PropertyValue
    
                            from [order]
                            left join Order_ExtendedProperties on pkOrderId = fkOrderId and PropertyName like 'VertexCall_${refundHeader}'
                            where 
                            source = '${source}' 
                            and subSource = '${subSource}' 
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
                                order = event.result.Results.find(r => {
                                    if (r.ProcessedOn) {
                                        return new Date(r.OrderDate).toISOString() === orderDate && new Date(r.ProcessedOn).toISOString() === processedDate;
                                    }
                                    else {
                                        return new Date(r.OrderDate).toISOString() === orderDate;
                                    }
                                });
                                if (order) {
                                    let buttons = document.getElementsByTagName("button");
                                    if (order.PropertyName && (order.PropertyValue.match(regex) || order.PropertyValue.toUpperCase() === "N")) {
                                        for (var button of buttons) {
                                            if (button.getAttribute("lw-tst") === "removeRefund") {
                                                // button.disabled = true;
                                                makeDisabled(button);
                                            }
                                        }
                                        let inputs2 = document.getElementsByTagName("input");
                                        for (var input2 of inputs2) {
                                            if (input2.getAttribute("ng-model") === "refund.Amount") {
                                                // input2.disabled = true;
                                                makeDisabled(input2);
                                            }
                                        }

                                    }
                                    else {
                                        for (var button of buttons) {
                                            if (button.getAttribute("lw-tst") === "btn_Action") {
                                                // button.disabled = true;
                                                makeDisabled(button);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                    if (order) {
                        let buttons = document.getElementsByTagName("button");
                        if (order.PropertyName && (order.PropertyValue.match(regex) || order.PropertyValue.toUpperCase() === "N")) {
                            for (var button of buttons) {
                                if (button.getAttribute("lw-tst") === "removeRefund") {
                                    // button.disabled = true;
                                    makeDisabled(button);
                                }
                            }
                            let inputs2 = document.getElementsByTagName("input");
                            for (var input2 of inputs2) {
                                if (input2.getAttribute("ng-model") === "refund.Amount") {
                                    // input2.disabled = true;
                                    makeDisabled(input2);
                                }
                            }

                        }
                        else {
                            for (var button of buttons) {
                                if (button.getAttribute("lw-tst") === "btn_Action") {
                                    // button.disabled = true;
                                    makeDisabled(button);
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
            if (!found) {
                customer = '';
                source = '';
                orderDate = '';
                orderTotal = '';
                subSource = '';
                refundHeader = '';
                processedDate = '';
                order = undefined;
            }
        }

        const observer = new MutationObserver(callback);
        setTimeout(function () {
            const targetNode = document.getElementsByTagName("body")[0];
            observer.observe(targetNode, config);
        }, 2000);
    })
});

