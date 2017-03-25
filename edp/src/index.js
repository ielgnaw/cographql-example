/**
 * @file [Please input file description]
 * @author ()
 */

define(function (require, exports, module) {
    var sendNode = $('#send');

    function sendFunc(e) {
        $.ajax({
            url: '/cgql/query',
            data: {
                query: "query mm {\n  author(id: 5) {\n    id\n    name\n    cc\n  }\n}\n",
                variables: '',
                operationName: 'mm'
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.error(arguments);
            },
            complete: function () {
                console.warn('complete');
            }
        });
    }

    function init() {
        sendNode.on('click', sendFunc);
    }

    exports.init = init;
});
