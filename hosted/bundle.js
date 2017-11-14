"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: "hide" }, 350);

    if ($("#domoName").val() == "" || $("#domoAge").val() == "" || $("#domoWeight").val() == "") {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

var Delete = function Delete(e, name, id) {
    e.preventDefault();

    var data = void 0;

    sendAjax("GET", "/getToken", null, function (result) {

        data = "name=" + name + "&id=" + id + "&_csrf=" + result.csrfToken;

        sendAjax("POST", "/delete", data, function () {
            loadDomosFromServer();
        });
    });

    return false;
};

var Change = function Change(e, Oldname, id) {
    e.preventDefault();

    sendAjax("GET", "/getToken", null, function (result) {

        var name = document.querySelector("#domoIName").value;
        var age = document.querySelector("#domoIAge").value;
        var weight = document.querySelector("#domoIWeight").value;

        var data = "oldname=" + Oldname + "&name=" + name + "&age=" + age + "&weight=" + weight + "&id=" + id + "&_csrf=" + result.csrfToken;

        sendAjax("POST", "/change", data, function () {
            loadDomosFromServer();
        });
    });
};

var EditDeleteButton = function EditDeleteButton(e, name, age, weight, id) {
    e.preventDefault();

    console.log(name);
    console.log(age);
    console.log(weight);
    console.log(id);

    ReactDOM.render(React.createElement(EditDelete, { name: name, age: age, weight: weight, id: id }), document.querySelector("#domos"));
};

var EditDelete = function EditDelete(props) {
    console.log(props.weight);
    console.log(props.name);
    console.log(props.age);
    console.log(props.id);
    return React.createElement(
        "div",
        { id: "EditDomo" },
        React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
        React.createElement(
            "h3",
            { id: "NameLabel" },
            "Name: ",
            props.name
        ),
        React.createElement(
            "h3",
            { id: "AgeLabel" },
            "Age: ",
            props.age
        ),
        React.createElement(
            "h3",
            { id: "WeightDLabel" },
            "Weight: ",
            props.weight
        ),
        React.createElement(
            "label",
            { id: "NameChangeLabel", htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoIName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { id: "AgeChangeLabel", htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoIAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { id: "WeightChangeLabel", htmlFor: "weight" },
            "Weight(in lbs): "
        ),
        React.createElement("input", { id: "domoIWeight", type: "text", name: "weight", placeholder: "Domo Weight" }),
        React.createElement(
            "button",
            { id: "DeleteButton", onClick: function onClick(e) {
                    return Delete(e, props.name, props.id);
                } },
            " Delete"
        ),
        React.createElement(
            "button",
            { id: "ChangeButton", onClick: function onClick(e) {
                    return Change(e, props.name, props.id);
                } },
            " Change"
        )
    );
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm", onSubmit: handleDomo, name: "domoForm", action: "/maker", method: "POST", className: "domoForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { id: "weightLabel", htmlFor: "weight" },
            "Weight(in lbs): "
        ),
        React.createElement("input", { id: "domoWeight", type: "text", name: "weight", placeholder: "Domo Weight" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                domo.name
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Age: ",
                domo.age
            ),
            React.createElement(
                "h3",
                { className: "domoWeight" },
                "Weight: ",
                domo.weight,
                " lbs"
            ),
            React.createElement(
                "button",
                { onClick: function onClick(e) {
                        return EditDeleteButton(e, domo.name, domo.age, domo.weight, domo._id);
                    } },
                "Edit or Delete"
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax("GET", "/getDomos", null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: "toggle" }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: "hide" }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
