"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };
        const tooltipStyleOld = '' +
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
        var tooltipStyle = '' +
            ' <style>' +
            '        .has-tooltip {' +
            '            /*position: relative;*/' +
            '            display: inline;' +
            '        }' +
            '' +
            '        .tooltip-wrapper {' +
            '            position: absolute;' +
            '            z-index: 100000;' +
            '            visibility: hidden;' +
            '        }' +
            '' +
            '        .has-tooltip:hover .tooltip-wrapper {' +
            '            visibility: visible;' +
            '            opacity: 0.7;' +
            '        }' +
            '' +
            '        .tooltip {' +
            '            display: block;' +
            '            position: relative;' +
            '            z-index: 100000;' +
            '            top: 2em;' +
            '            right: 100%;' +
            '            width: 140px;' +
            '            height: 96px;' +
            '            /*margin-left: -76px;*/' +
            '            color: #FFFFFF;' +
            '            background: #000000;' +
            '            line-height: 96px;' +
            '            text-align: center;' +
            '            border-radius: 8px;' +
            '            box-shadow: 4px 3px 10px #800000;' +
            '        }' +
            '' +
            '        .tooltip:after {' +
            '            content: \'\';' +
            '            position: absolute;' +
            '            bottom: 100%;' +
            '            left: 50%;' +
            '            margin-left: -8px;' +
            '            width: 0;' +
            '            height: 0;' +
            '            border-bottom: 8px solid #000000;' +
            '            border-right: 8px solid transparent;' +
            '            border-left: 8px solid transparent;' +
            '        }' +
            '    </style>' +
            '';
        var innerTooltip = ' ' +
            '<span class="tooltip-wrapper"><span class="tooltip">Tooltip</span></span>' +
            '';

        const makeDisabled = (element) => {

            if (!element.className.includes("click-removed")) {

                // element.disabled = true;
                let newE = element.cloneNode(true);

                newE.className += " click-removed";

                // let innerEl = document.createElement("span");
                // innerEl.onclick = function () { alert('1'); };
                // // innerEl.setAttribute("onclick", "alert('2');");
                // // innerEl.setAttribute("click", "alert('3');");
                // innerEl.style.display = "block";
                // newE.appendChild(innerEl);

                newE.removeAttribute("onclick");
                newE.removeAttribute("click");
                newE.onclick = null;

                newE.onclick = function () {
                    var divWithButtons = body.getElementsByClassName("buttons")[0];
                    if (divWithButtons) {
                        for (var span of divWithButtons.getElementsByTagName("span")) {
                            if (span.classList.contains("invalidity")) {
                                return;
                            }
                        }


                        var tagSpan = document.createElement("span");
                        tagSpan.style.cssText = 'float:left;color:red;';
                        var tagI = document.createElement("i");
                        tagI.innerHTML = "TEST"
                        tagI.setAttribute("id", "custom-invalidity-text");


                        tagSpan.appendChild(tagI);
                        divWithButtons.insertBefore(tagSpan, divWithButtons.firstChild);


                    }

                    alert('1');

                };
                // newE.setAttribute("onclick", "alert('2');");
                // newE.setAttribute("click", "alert('3');");

                element.replaceWith(newE);
            }


            // let a = newE;
            // let elems = [];
            // while (a) {
            //     elems.unshift(a);
            //     a = a.parentElement;
            // }
            // for (var elem of elems) {
            //     // if (elem.className.includes("btn")) {
            //     //     if (!elem.innerHTML.includes("span")) {

            //     //     }
            //     //     elem.style.overflow = "visible";
            //     //     elem.removeAttribute("title");
            //     // }
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

