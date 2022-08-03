"use strict";

define(function (require) {
    $(document).ready(function ($scope) {
        try {
            const config = { childList: true, subtree: true };

            var callback = function (mutationsList, observer) {
                try {
                    // if (!userPermissions?.canSeeTheApp) {
                    //     var appsContainer = document.getElementsByClassName("cdk-overlay-container")[0];
                    //     if (appsContainer) {
                    //         var moduleContainers = appsContainer.getElementsByClassName("moduleContainer");
                    //         if (moduleContainers.length > 0) {
                    //             for (var moduleContainer of moduleContainers) {
                    //                 var nameModule = moduleContainer.getElementsByClassName("module-name-text")[0];
                    //                 if (nameModule) {
                    //                     if (nameModule.getAttribute("title") === "Custom Permissions Setup") {
                    //                         moduleContainer.innerHTML = "";
                    //                         break;
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                } catch (error) {
                    console.log("BACKORDER SCREEN ERROR");
                    console.log(error);
                }

            }
            const observer = new MutationObserver(callback);

            const session = JSON.parse(window.localStorage.getItem("SPA_auth_session"));

            // const userPermissions = JSON.parse(getUserPermissions(session.email, session.userName));
            const userPermissions = {};

            setTimeout(function () {
                try {
                    var header = document.getElementsByClassName("header-panel")[0];
                    var elements = header.getElementsByClassName("ng-star-inserted");
                    for (var element of elements) {
                        var emails = element.innerHTML.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
                        if (emails.length > 0) {
                            var kek = emails[0];
                        }
                    }


                    const targetNode = document.getElementsByTagName("body")[0];
                    observer.observe(targetNode, config);
                } catch (error) {
                    console.log("BACKORDER SCREEN ERROR");
                    console.log(error);
                }
            }, 2000);
        } catch (error) {
            console.log("BACKORDER SCREEN ERROR");
            console.log(error);
        }
    });

    function getUserPermissions(ownerEmail, userEmail) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", `https://localhost:5001/api/Permission/${ownerEmail}/${userEmail}`, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    function extractEmails(text) {
        return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
    }
});