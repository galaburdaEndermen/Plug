"use strict";

define(function (require) {
    $(document).ready(function ($scope) {

        const placeholderManager = require("core/placeholderManager");
        const ngComponent = require("core/ngComponent");

        const macroService = new Services.MacroService(self);


        const session = JSON.parse(window.localStorage.getItem("SPA_auth_session"));
        const token = window.localStorage.getItem("access_token");
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", `${session.server}/api/extensions/getInstalledExtensions`, false);
        xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`);
        xmlHttp.send(null);
        let res1 = xmlHttp.responseText;

        var xmlHttp2 = new XMLHttpRequest();
        xmlHttp2.open("GET", `${session.server}/api/extensions/getTemporaryToken?applicationId=e671c34f-4d16-498f-8813-fefd3d76a825`, false);
        xmlHttp2.setRequestHeader('Authorization', `Bearer ${token}`);
        xmlHttp2.send(null);
        let res2 = xmlHttp2.responseText;



        // var popUpWindow;
        // function popup(n) {
        //     popUpWindow = window.open(n);
        // }
        // function foo(obj) {
        //     test1 = "http://localhost:8080/test/document.html?" + obj.innerHTML;
        //     popUpWindow.document.write('<iframe height="450" allowTransparency="true" frameborder="0" scrolling="yes" style="width:100%;" src="' + test1 + '" type= "text/javascript"></iframe>');

        // }

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