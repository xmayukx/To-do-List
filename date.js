exports.getDate = function () {

    let today = new Date();
    let option = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return today.toLocaleDateString("en-US", option);
}

exports.getDay = function () {

    let today = new Date();
    let option = {
        weekday: 'long',
    };

    return today.toLocaleDateString("en-US", option);
}

