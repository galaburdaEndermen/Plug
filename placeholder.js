"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };

        var select_returnForm;
        var input_returnForm;
        var select_resendForm;
        var input_resendForm;

        var allowedQuantity = 0;
        var isAllowedQuantitySet = false;
        var refundSum = 0.0;
        var isRefundSumSet = false;

        var callback = function (mutationsList, observer) {

            if (userPermissions) {
                let kek = 'sass';
            }
        };

        function isReturnFormValid() {
            var btn = getSubmitButton("Add Return");
            if (!btn) {
                return;
            }

            if (!select_returnForm || !input_returnForm) {
                btn.disabled = true;
                return;
            }

            if (select_returnForm.value === "?") {
                btn.disabled = true;
                select_returnForm.classList.add("selectInvalid");
                addInvalidityText("Reason category is mandatory field");
                return;
            }
            else {
                select_returnForm.classList.remove("selectInvalid");
                addInvalidityText("");
            }

            if (!isNum(input_returnForm.value) || parseInt(input_returnForm.value) <= 0
                || parseInt(input_returnForm.value) != allowedQuantity) {
                btn.disabled = true;
                addInvalidityText("Return quantity must be equal to ordered quantity");
                return;
            }
            else {
                addInvalidityText("");
            }

            btn.disabled = false;
        }

        function isResendFormValid() {
            var btn = getSubmitButton("Add Resend");
            if (!btn) {
                return;
            }

            if (!select_resendForm || !input_resendForm) {
                btn.disabled = true;
                return;
            }

            if (select_resendForm.value === "?") {
                btn.disabled = true;
                select_resendForm.classList.add("selectInvalid");
                addInvalidityText("Reason category is mandatory field");
                return;
            }
            else {
                select_resendForm.classList.remove("selectInvalid");
                addInvalidityText("");
            }

            if (!isNum(input_resendForm.value) || parseInt(input_resendForm.value) <= 0
                || parseInt(input_resendForm.value) > allowedQuantity) {
                btn.disabled = true;
                addInvalidityText("Resend quantity must be equal to ordered quantity");
                return;
            }
            else {
                addInvalidityText("");
            }

            btn.disabled = false;
        }

        function addInvalidityText(text) {
            let iTag = document.getElementById("custom-invalidity-text");
            if (iTag) {
                var textNode = document.createTextNode(text);
                iTag.innerHTML = "";
                iTag.appendChild(textNode);
            }
        }

        function isNum(str) {
            return /^\d+$/.test(str);
        }

        function getSubmitButton(text) {
            var btnsDiv = document.getElementsByClassName("buttons")[1];
            if (btnsDiv) {
                var buttons = btnsDiv.getElementsByTagName("button");
                if (buttons) {
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i].firstChild.nodeValue === text) {
                            return buttons[i];
                        }
                    }
                }
            }
        }

        const observer = new MutationObserver(callback);

        const session = JSON.parse(window.localStorage.getItem("SPA_auth_session"));

        const userPermissions = JSON.parse(getUserPermissions(session.email, session.userName));

        setTimeout(function () {
            const targetNode = document.getElementsByTagName("body")[0];
            observer.observe(targetNode, config);
        }, 2000);
    });

    function getUserPermissions(ownerEmail, userEmail) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", `https://localhost:5001/api/Permission/${ownerEmail}/${userEmail}`, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }
});