"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };

        var callback = function (mutationsList, observer) {

            if (!userPermissions.canSeeTheApp) {
                var appsContainer = document.getElementsByClassName("cdk-overlay-container")[0];
                if (appsContainer) {
                    var moduleContainers = appsContainer.getElementsByClassName("moduleContainer");
                    if (moduleContainers.length > 0) {
                        for (var moduleContainer of moduleContainers) {
                            var nameModule = moduleContainer.getElementsByClassName("module-name-text")[0];
                            if (nameModule) {
                                if (nameModule.getAttribute("title") === "Custom Permissions Setup") {
                                    moduleContainer.innerHTML = "";
                                    break;
                                }
                            }
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