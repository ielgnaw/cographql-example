/**
 * @file [Please input file description]
 * @author ()
 */

define(function (require, exports, module) {

    // query: "mutation {\n  upvotePost(postId: 2){\n    title\n  }\n}",
    // query: "mutation ($s:Int!) {\n  upvotePost(postId: $s){\n    title\n  }\n}\n",
    // variables: JSON.stringify({"s": 2}),

    var search = window.location.search;
    var parameters = {};
    search.substr(1).split('&').forEach(function (entry) {
        var eq = entry.indexOf('=');
        if (eq >= 0) {
            parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(entry.slice(eq + 1));
        }
    });

    if (parameters.variables) {
        try {
            parameters.variables = JSON.stringify(JSON.parse(parameters.variables), null, 2);
        }
        catch (e) {
        }
    }

    function onEditQuery(newQuery) {
        parameters.query = newQuery;
        updateURL();
    }

    function onEditVariables(newVariables) {
        parameters.variables = newVariables;
        updateURL();
    }

    function onEditOperationName(newOperationName) {
        parameters.operationName = newOperationName;
        updateURL();
    }

    function updateURL() {
        var newSearch = '?' + Object.keys(parameters).filter(function (key) {
            return Boolean(parameters[key]);
        }).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]);
        }).join('&');
        history.replaceState(null, null, newSearch);
    }

    function graphQLFetcher(graphQLParams) {
        return fetch('/cgql/query', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(graphQLParams),
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data.status !== 0) {
                return data.statusInfo;
            }
            return data.data;
        });
    }

    function init() {
        ReactDOM.render(
            React.createElement(GraphiQL, {
                fetcher: graphQLFetcher,
                query: parameters.query,
                variables: parameters.variables,
                operationName: parameters.operationName,
                onEditQuery: onEditQuery,
                onEditVariables: onEditVariables,
                onEditOperationName: onEditOperationName
            }),
            document.getElementById('graphiql')
        );
    }

    exports.init = init;
});
