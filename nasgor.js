// NASGOR.js is Navigation Single-Page Orientation
// Make single page app with jquery with easy setup and small size library

// the data onclick navigation with tag <a> or some tag:

// navId: id for key the <a> href button to swith page in container
// route: is last pieces in url web, after symbol #, this mean route or link the page
// containerId: this id for container can be switch page from any html
// urlHtml: this address place html with extension (html) from root project (index.html)

// EXAMPLE:
// var listData = [
//     {
//         navId: "nav-first",
//         route: "home",
//         containerId: "container-view",
//         urlHtml: "pages/mainpage.html"
//     },
// ]

// var data: "listData", "isCantLeaveApp"
// var callback: onReady, onChange, onPush, onPop, onLastPop

function initNasgor(data, callback) {
    function getRouteNasgor() {
        try {
            var url = window.location.href
            var route = url.split("#")[1]
            return route
        } catch (error) {
            return ""
        }
    }
    function getItemByRouteNasgor(route, list) {
        try {
            return list.find(function(e) {
                return e.route == route
            })
        } catch (error) {
            return null
        }
    }
    $(document).ready(function(){
        var isHasClicked = false
        var isCantLeaveApp = false
        if (data.isCantLeaveApp === undefined || data.isCantLeaveApp == null) {
            isCantLeaveApp = false
        } else {
            isCantLeaveApp = data.isCantLeaveApp
        }
        $(`#nasgor-nav`).remove()
        $("body").append(`<span id="nasgor-nav"></span>`)
        data.listData.forEach(
            function(e, i) {
                $(`#nasgor-nav`).append(
                    `<a id="nasgor-${e.route}" href="#${e.route}"></a>`
                )
                $(`#${e.navId}`).click(
                    function() {
                        if(e.route == getRouteNasgor()) {
                            return
                        }
                        var navId = getItemByRouteNasgor(e.route, data.listData).navId
                        isHasClicked = true
                        $(`#${e.containerId}`).load(e.urlHtml)
                        $(`#nasgor-${e.route}`)[0].click();
                        callback.onChange(navId, e.route)
                        callback.onPush(navId, e.route)
                    }
                )
            }
        );
        window.onhashchange = function() {
            var route = getRouteNasgor()
            var item = getItemByRouteNasgor(route, data.listData)
            if(item === undefined) {
                var routeDefault = getRouteNasgor()
                var firstData = data.listData[0]
                callback.onPop(firstData.navId, routeDefault)
                callback.onLastPop(firstData.navId, routeDefault)
                if (isCantLeaveApp) {
                    $(`#${firstData.containerId}`).load(firstData.urlHtml)
                    $(`#nasgor-${firstData.route}`)[0].click();
                }
                return
            }
            callback.onChange(item.navId, route)
            if (isHasClicked) {
                isHasClicked = false
                return
            }
            $(`#${item.containerId}`).load(item.urlHtml)
            $(`#nasgor-${item.route}`)[0].click();
            callback.onPop(item.navId, route)
        }
        var route = getRouteNasgor()
        var firstData = data.listData[0]
        callback.onReady(firstData.navId, route)
        $(`#${firstData.containerId}`).load(firstData.urlHtml)
        $(`#nasgor-${firstData.route}`)[0].click();
    })
}
