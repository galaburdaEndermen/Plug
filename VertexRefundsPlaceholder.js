"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };

        const makeButtonDisabled = (element, message) => {
            if (!element.className.includes("click-removed")) {
                let newE = element.cloneNode(true);
                newE.className += " click-removed";

                newE.removeAttribute("onclick");
                newE.removeAttribute("click");
                newE.onclick = null;
                let error = message;

                newE.onclick = function () {
                    var divWithButtons = document.getElementsByClassName("buttons")[0];
                    if (divWithButtons) {
                        for (var span of divWithButtons.getElementsByTagName("span")) {
                            if (span.innerHTML.contains(error)) {
                                return;
                            }
                        }
                        for (var span of divWithButtons.getElementsByTagName("span")) {
                            if (span.innerHTML.contains('custom-invalidity-text')) {
                                var tagI = document.createElement("i");
                                tagI.innerHTML = error;
                                tagI.setAttribute("id", "custom-invalidity-text");
                                let br = document.createElement("br");
                                span.appendChild(br);
                                span.appendChild(tagI);

                                setTimeout(() => {
                                    span.remove();
                                }, 5000);
                                return;
                            }
                        }


                        var tagSpan = document.createElement("span");
                        tagSpan.style.cssText = 'float:left;color:red;text-align:left;';
                        var tagI = document.createElement("i");
                        tagI.innerHTML = error;
                        tagI.setAttribute("id", "custom-invalidity-text");

                        tagSpan.appendChild(tagI);
                        divWithButtons.insertBefore(tagSpan, divWithButtons.firstChild);

                        setTimeout(() => {
                            tagSpan.remove();
                        }, 5000);
                    }
                };
                element.replaceWith(newE);
            }
        }

        const makeInputDisabled = (element) => {
            if (!element.disabled) {
                element.disabled = true;
                let error = "Refund amount cannot be modified on this order, please contact Tech Support";

                var divWithButtons = document.getElementsByClassName("buttons")[0];
                if (divWithButtons) {
                    for (var span of divWithButtons.getElementsByTagName("span")) {
                        if (span.innerHTML.contains(error)) {
                            return;
                        }
                    }
                    for (var span of divWithButtons.getElementsByTagName("span")) {
                        if (span.innerHTML.contains('custom-invalidity-text')) {
                            var tagI = document.createElement("i");
                            tagI.innerHTML = error;
                            tagI.setAttribute("id", "custom-invalidity-text");
                            let br = document.createElement("br");
                            span.appendChild(br);
                            span.appendChild(tagI);

                            setTimeout(() => {
                                span.remove();
                            }, 5000);
                            return;
                        }
                    }

                    var tagSpan = document.createElement("span");
                    tagSpan.style.cssText = 'float:left;color:red;text-align:left;';
                    var tagI = document.createElement("i");
                    tagI.innerHTML = error;
                    tagI.setAttribute("id", "custom-invalidity-text");

                    tagSpan.appendChild(tagI);
                    divWithButtons.insertBefore(tagSpan, divWithButtons.firstChild);

                    setTimeout(() => {
                        tagSpan.remove();
                    }, 5000);
                }
            }
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
                                                makeButtonDisabled(button, "Refund cannot be deleted on this order, please contact Tech Support");
                                            }
                                        }
                                        let inputs2 = document.getElementsByTagName("input");
                                        for (var input2 of inputs2) {
                                            if (input2.getAttribute("ng-model") === "refund.Amount") {
                                                makeInputDisabled(input2);
                                            }
                                        }

                                    }
                                    else {
                                        for (var button of buttons) {
                                            if (button.getAttribute("lw-tst") === "btn_Action") {
                                                makeButtonDisabled(button, "This refund is not yet Actionable, please try after sometime");
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
                                    makeButtonDisabled(button, "Refund cannot be deleted on this order, please contact Tech Support");
                                }
                            }
                            let inputs2 = document.getElementsByTagName("input");
                            for (var input2 of inputs2) {
                                if (input2.getAttribute("ng-model") === "refund.Amount") {
                                    makeInputDisabled(input2);
                                }
                            }

                        }
                        else {
                            for (var button of buttons) {
                                if (button.getAttribute("lw-tst") === "btn_Action") {
                                    makeButtonDisabled(button, "This refund is not yet Actionable, please try after sometime");
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

