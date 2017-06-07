module.exports = {
	set: function(key, value, options) {
        var options = options || {};
        options.domain = options.domain || "";
        options.path = options.path || "/";
        options.expires = options.expires || 3600000 * 24 * 365;
        if (typeof options.expires == "number") {
            var now = new Date();
            now.setTime(now.getTime() + options.expires);
        };
        document.cookie = key + "=" + value + ";expires=" + now.toGMTString() + (options.domain ? ";domain=" + options.domain : "") + ";path=" + options.path;
    },
    get: function(key) {
        var cookieName = encodeURIComponent(key) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null,
            cookieEnd;

        if (cookieStart > -1) {
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    remove: function(key) {
        this.set(key, "", {
            expires: -3600
        });
    }
}