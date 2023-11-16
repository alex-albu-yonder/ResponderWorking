/**
 * @ngdoc overview
 * @name CordovaUTIL
*/
angular.module('verklizan.umox.common.html5.vkz-utilities', [
    'verklizan.umox.common.html5.vkz-utilities.general',
    'verklizan.umox.common.html5.vkz-utilities.storage',
    'verklizan.umox.common.html5.vkz-utilities.settings',
    'verklizan.umox.common.html5.vkz-utilities.localisation',
    'verklizan.umox.common.html5.vkz-utilities.dateConversion'
]);

angular.module('verklizan.umox.common.html5.vkz-utilities.general', []);
angular.module('verklizan.umox.common.html5.vkz-utilities.storage', []);
angular.module('verklizan.umox.common.html5.vkz-utilities.dateConversion', []);

angular.module('verklizan.umox.common.html5.vkz-utilities.localisation', [
    'verklizan.umox.common.html5.vkz-utilities.settings'
]);

angular.module('verklizan.umox.common.html5.vkz-utilities.settings', [
    'verklizan.umox.common.html5.vkz-utilities.storage',
    'verklizan.umox.common.html5.vkz-utilities.general'
]);


/**
 * @ngdoc service
 * @name CordovaUTIL.dateExtensionService
 *
 * @description
 * The dateExtensionService is responsible for formatting the date.
 *
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.dateConversion').factory('dateExtensionService',
    function () {
        'use strict';

        // ============================
        // Private fields
        // ============================
        var dateExtensionService = {}

        // ============================
        // Public methods
        // ============================

        /**
         * @ngdoc method
         * @name convertDateToMsUtc
         * @methodOf CordovaUTIL.dateExtensionService
         * @param {object} date a date object.
         * @returns {string} a millisecond string format in the appropiate utc timezone.
         *
         * @description
         * Converts a (regular) date to the millisecond format and returns the time according to the Utc timezone.
        */
        dateExtensionService.convertDateToMsUtc = function (date) {

            if (!date) {
                return;
            }

            // Get the variables of the date according to the UTC timezone.
            var year = date.getUTCFullYear();
            var month = date.getUTCMonth();
            var day = date.getUTCDate();
            var hours = date.getUTCHours();
            var minutes = date.getUTCMinutes();
            var seconds = date.getUTCSeconds();

            // Set the date in millisecond format. This is the number of millseconds from a certain point in time until the specified date.
            var dateInMillisecondFormat = Date.UTC(
                year,
                month,
                day,
                hours,
                minutes,
                seconds);

            return '/Date(' + dateInMillisecondFormat + ')/';
        };

        /**
         * @ngdoc method
         * @name convertDateToMs
         * @methodOf CordovaUTIL.dateExtensionService
         * @param {object} date a date object.
         * @returns {string} a millisecond string format
         *
         * @description
         * Converts a (regular) date to the millisecond format without converting it to UTC.
        */
        dateExtensionService.convertDateToMs = function (date, ignoreSeconds) {

            if (!date) {
                return;
            }

            var dd = date.getDate();
            var mm = date.getMonth();
            var yy = date.getFullYear();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = ignoreSeconds === true ? 0 : date.getSeconds();

            // Convert date to UTC because otherwise "new Date()" will internally convert the date to a UTC date.
            var convertedDate = Date.UTC(yy, mm, dd, hours, minutes, seconds);

            return '/Date(' + convertedDate + ')/';
        };

        /**
         * @ngdoc method
         * @name convertMsToDateLocal
         * @methodOf CordovaUTIL.dateExtensionService
         * @param {string} inputDate a milliseconds-date
         * @returns {object} a DateTime object.
         *
         * @description
         * Converts a milliseconds-date to a regular date according to the local timezone.
        */
        dateExtensionService.convertMsToDateLocal = function (inputDate) {
            if (!inputDate) {
                return;
            }
            var momentDateObject = moment.parseZone(inputDate);
            return new Date(Date.UTC(momentDateObject.year(), momentDateObject.month(), momentDateObject.date(), momentDateObject.hours(), momentDateObject.minutes(), momentDateObject.seconds()));
        }

        /**
         * @ngdoc method
         * @name convertMsToDate
         * @methodOf CordovaUTIL.dateExtensionService
         * @param {string} inputDate a milliseconds-date
         * @returns {object} a DateTime object.
         *
         * @description
         * Converts a milliseconds-date to a regular date according to the local timezone.
        */
        dateExtensionService.convertMsToDate = function (inputDate) {
            if (!inputDate) {
                return;
            }

            return new Date(moment.parseZone(inputDate).format('YYYY-MM-DD[T]HH:mm:ss'));
        }

        /**
         * @ngdoc method
         * @name getDateFormat
         * @methodOf CordovaUTIL.dateExtensionService
         * @returns {string} a string following the yy/mm/dd format.
         *
         * @description
         * Get a string (format yyyy/mm/dd) of the current day.
        */
        dateExtensionService.getDateFormat = function () {
            var date = new Date();
            var dd = "" + date.getDate();
            var mm = "" + (date.getMonth() + 1); //January is 0!
            var yyyy = date.getFullYear();

            if (dd.length === 1) {
                dd = "0" + dd;
            }
            if (mm.length === 1) {
                mm = "0" + mm;
            }

            // The following format works for all browsers. See: http://dygraphs.com/date-formats.html
            return yyyy + "/" + mm + "/" + dd;
        };

        /**
         * @ngdoc method
         * @name getTimeZone
         * @methodOf CordovaUTIL.dateExtensionService
         * @returns {string} a string with a number representation of the timezone like '60-120'
         *
         * @description
         * Get the current timezone
        */
        dateExtensionService.getTimeZone = function () {
            var timeSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
            var summerOffset = -1 * timeSummer.getTimezoneOffset();
            var timeWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
            var winterOffset = -1 * timeWinter.getTimezoneOffset();
            return summerOffset + ":" + winterOffset;
        }

        /**
         * @ngdoc method
         * @name getTimeZone
         * @methodOf CordovaUTIL.dateExtensionService
         * @param {object} date Date that needs to be converted.
         * @param {boolean} isDateInMsUtc If the given date is a Microsoft date in utc.
         * @returns {boolean} if the date is in the future.
         *
         * @description
         * Determines if the date is in the future.
        */
        dateExtensionService.dateIsInTheFuture = function (date, isDateInMsUtc) {
            if (date === null || typeof date === "undefined")
                return false;

            var currentDate = new Date();

            if (isDateInMsUtc === true) {
                date = dateExtensionService.convertMsToDateLocal(date);
            }

            return date > currentDate;
        }

        dateExtensionService.supportsDaylightSavingTime = function(date) {
            var jan = new Date(date.getFullYear(), 0, 1);
            var jul = new Date(date.getFullYear(), 6, 1);
            var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

            return date.getTimezoneOffset() < stdTimezoneOffset;
        }

        // ============================
        // Private methods
        // ============================

        // ------------------------------------
        // getDateTimeFormat
        // ------------------------------------
        // Converts a date-time to a certain format (which works in all browsers).
        function getDateTimeFormat(date) {
            var dd = "" + date.getDate();
            var mm = "" + (date.getMonth() + 1); //January is 0!
            var yyyy = date.getFullYear();
            var hours = date.getHours().toString();
            var minutes = date.getMinutes().toString();
            var seconds = date.getSeconds().toString();

            if (dd.length === 1) {
                dd = "0" + dd;
            }
            if (mm.length === 1) {
                mm = "0" + mm;
            }
            if (hours.length === 1) {
                hours = "0" + hours;
            }
            if (minutes.length === 1) {
                minutes = "0" + minutes;
            }
            if (seconds.length === 1) {
                seconds = "0" + seconds;
            }

            // The following format works for all browsers. See: http://dygraphs.com/date-formats.html
            return yyyy + "/" + mm + "/" + dd + " " + hours + ":" + minutes + ":" + seconds;
        }

        return dateExtensionService;
    }
);
/* istanbul ignore next */
!function (e, t) { "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.moment = t() }(this, function () { "use strict"; var e, i; function c() { return e.apply(null, arguments) } function o(e) { return e instanceof Array || "[object Array]" === Object.prototype.toString.call(e) } function u(e) { return null != e && "[object Object]" === Object.prototype.toString.call(e) } function l(e) { return void 0 === e } function d(e) { return "number" == typeof e || "[object Number]" === Object.prototype.toString.call(e) } function h(e) { return e instanceof Date || "[object Date]" === Object.prototype.toString.call(e) } function f(e, t) { var n, s = []; for (n = 0; n < e.length; ++n) s.push(t(e[n], n)); return s } function m(e, t) { return Object.prototype.hasOwnProperty.call(e, t) } function _(e, t) { for (var n in t) m(t, n) && (e[n] = t[n]); return m(t, "toString") && (e.toString = t.toString), m(t, "valueOf") && (e.valueOf = t.valueOf), e } function y(e, t, n, s) { return Ot(e, t, n, s, !0).utc() } function g(e) { return null == e._pf && (e._pf = { empty: !1, unusedTokens: [], unusedInput: [], overflow: -2, charsLeftOver: 0, nullInput: !1, invalidMonth: null, invalidFormat: !1, userInvalidated: !1, iso: !1, parsedDateParts: [], meridiem: null, rfc2822: !1, weekdayMismatch: !1 }), e._pf } function p(e) { if (null == e._isValid) { var t = g(e), n = i.call(t.parsedDateParts, function (e) { return null != e }), s = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidMonth && !t.invalidWeekday && !t.weekdayMismatch && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || t.meridiem && n); if (e._strict && (s = s && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour), null != Object.isFrozen && Object.isFrozen(e)) return s; e._isValid = s } return e._isValid } function v(e) { var t = y(NaN); return null != e ? _(g(t), e) : g(t).userInvalidated = !0, t } i = Array.prototype.some ? Array.prototype.some : function (e) { for (var t = Object(this), n = t.length >>> 0, s = 0; s < n; s++) if (s in t && e.call(this, t[s], s, t)) return !0; return !1 }; var r = c.momentProperties = []; function w(e, t) { var n, s, i; if (l(t._isAMomentObject) || (e._isAMomentObject = t._isAMomentObject), l(t._i) || (e._i = t._i), l(t._f) || (e._f = t._f), l(t._l) || (e._l = t._l), l(t._strict) || (e._strict = t._strict), l(t._tzm) || (e._tzm = t._tzm), l(t._isUTC) || (e._isUTC = t._isUTC), l(t._offset) || (e._offset = t._offset), l(t._pf) || (e._pf = g(t)), l(t._locale) || (e._locale = t._locale), 0 < r.length) for (n = 0; n < r.length; n++) l(i = t[s = r[n]]) || (e[s] = i); return e } var t = !1; function M(e) { w(this, e), this._d = new Date(null != e._d ? e._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === t && (t = !0, c.updateOffset(this), t = !1) } function S(e) { return e instanceof M || null != e && null != e._isAMomentObject } function D(e) { return e < 0 ? Math.ceil(e) || 0 : Math.floor(e) } function k(e) { var t = +e, n = 0; return 0 !== t && isFinite(t) && (n = D(t)), n } function a(e, t, n) { var s, i = Math.min(e.length, t.length), r = Math.abs(e.length - t.length), a = 0; for (s = 0; s < i; s++) (n && e[s] !== t[s] || !n && k(e[s]) !== k(t[s])) && a++; return a + r } function Y(e) { !1 === c.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + e) } function n(i, r) { var a = !0; return _(function () { if (null != c.deprecationHandler && c.deprecationHandler(null, i), a) { for (var e, t = [], n = 0; n < arguments.length; n++) { if (e = "", "object" == typeof arguments[n]) { for (var s in e += "\n[" + n + "] ", arguments[0]) e += s + ": " + arguments[0][s] + ", "; e = e.slice(0, -2) } else e = arguments[n]; t.push(e) } Y(i + "\nArguments: " + Array.prototype.slice.call(t).join("") + "\n" + (new Error).stack), a = !1 } return r.apply(this, arguments) }, r) } var s, O = {}; function T(e, t) { null != c.deprecationHandler && c.deprecationHandler(e, t), O[e] || (Y(t), O[e] = !0) } function x(e) { return e instanceof Function || "[object Function]" === Object.prototype.toString.call(e) } function b(e, t) { var n, s = _({}, e); for (n in t) m(t, n) && (u(e[n]) && u(t[n]) ? (s[n] = {}, _(s[n], e[n]), _(s[n], t[n])) : null != t[n] ? s[n] = t[n] : delete s[n]); for (n in e) m(e, n) && !m(t, n) && u(e[n]) && (s[n] = _({}, s[n])); return s } function P(e) { null != e && this.set(e) } c.suppressDeprecationWarnings = !1, c.deprecationHandler = null, s = Object.keys ? Object.keys : function (e) { var t, n = []; for (t in e) m(e, t) && n.push(t); return n }; var W = {}; function H(e, t) { var n = e.toLowerCase(); W[n] = W[n + "s"] = W[t] = e } function R(e) { return "string" == typeof e ? W[e] || W[e.toLowerCase()] : void 0 } function C(e) { var t, n, s = {}; for (n in e) m(e, n) && (t = R(n)) && (s[t] = e[n]); return s } var F = {}; function L(e, t) { F[e] = t } function U(e, t, n) { var s = "" + Math.abs(e), i = t - s.length; return (0 <= e ? n ? "+" : "" : "-") + Math.pow(10, Math.max(0, i)).toString().substr(1) + s } var N = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, G = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, V = {}, E = {}; function I(e, t, n, s) { var i = s; "string" == typeof s && (i = function () { return this[s]() }), e && (E[e] = i), t && (E[t[0]] = function () { return U(i.apply(this, arguments), t[1], t[2]) }), n && (E[n] = function () { return this.localeData().ordinal(i.apply(this, arguments), e) }) } function A(e, t) { return e.isValid() ? (t = j(t, e.localeData()), V[t] = V[t] || function (s) { var e, i, t, r = s.match(N); for (e = 0, i = r.length; e < i; e++) E[r[e]] ? r[e] = E[r[e]] : r[e] = (t = r[e]).match(/\[[\s\S]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, ""); return function (e) { var t, n = ""; for (t = 0; t < i; t++) n += x(r[t]) ? r[t].call(e, s) : r[t]; return n } }(t), V[t](e)) : e.localeData().invalidDate() } function j(e, t) { var n = 5; function s(e) { return t.longDateFormat(e) || e } for (G.lastIndex = 0; 0 <= n && G.test(e) ;) e = e.replace(G, s), G.lastIndex = 0, n -= 1; return e } var Z = /\d/, z = /\d\d/, $ = /\d{3}/, q = /\d{4}/, J = /[+-]?\d{6}/, B = /\d\d?/, Q = /\d\d\d\d?/, X = /\d\d\d\d\d\d?/, K = /\d{1,3}/, ee = /\d{1,4}/, te = /[+-]?\d{1,6}/, ne = /\d+/, se = /[+-]?\d+/, ie = /Z|[+-]\d\d:?\d\d/gi, re = /Z|[+-]\d\d(?::?\d\d)?/gi, ae = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, oe = {}; function ue(e, n, s) { oe[e] = x(n) ? n : function (e, t) { return e && s ? s : n } } function le(e, t) { return m(oe, e) ? oe[e](t._strict, t._locale) : new RegExp(de(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (e, t, n, s, i) { return t || n || s || i }))) } function de(e) { return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") } var he = {}; function ce(e, n) { var t, s = n; for ("string" == typeof e && (e = [e]), d(n) && (s = function (e, t) { t[n] = k(e) }), t = 0; t < e.length; t++) he[e[t]] = s } function fe(e, i) { ce(e, function (e, t, n, s) { n._w = n._w || {}, i(e, n._w, n, s) }) } var me = 0, _e = 1, ye = 2, ge = 3, pe = 4, ve = 5, we = 6, Me = 7, Se = 8; function De(e) { return ke(e) ? 366 : 365 } function ke(e) { return e % 4 == 0 && e % 100 != 0 || e % 400 == 0 } I("Y", 0, 0, function () { var e = this.year(); return e <= 9999 ? "" + e : "+" + e }), I(0, ["YY", 2], 0, function () { return this.year() % 100 }), I(0, ["YYYY", 4], 0, "year"), I(0, ["YYYYY", 5], 0, "year"), I(0, ["YYYYYY", 6, !0], 0, "year"), H("year", "y"), L("year", 1), ue("Y", se), ue("YY", B, z), ue("YYYY", ee, q), ue("YYYYY", te, J), ue("YYYYYY", te, J), ce(["YYYYY", "YYYYYY"], me), ce("YYYY", function (e, t) { t[me] = 2 === e.length ? c.parseTwoDigitYear(e) : k(e) }), ce("YY", function (e, t) { t[me] = c.parseTwoDigitYear(e) }), ce("Y", function (e, t) { t[me] = parseInt(e, 10) }), c.parseTwoDigitYear = function (e) { return k(e) + (68 < k(e) ? 1900 : 2e3) }; var Ye, Oe = Te("FullYear", !0); function Te(t, n) { return function (e) { return null != e ? (be(this, t, e), c.updateOffset(this, n), this) : xe(this, t) } } function xe(e, t) { return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN } function be(e, t, n) { e.isValid() && !isNaN(n) && ("FullYear" === t && ke(e.year()) && 1 === e.month() && 29 === e.date() ? e._d["set" + (e._isUTC ? "UTC" : "") + t](n, e.month(), Pe(n, e.month())) : e._d["set" + (e._isUTC ? "UTC" : "") + t](n)) } function Pe(e, t) { if (isNaN(e) || isNaN(t)) return NaN; var n, s = (t % (n = 12) + n) % n; return e += (t - s) / 12, 1 === s ? ke(e) ? 29 : 28 : 31 - s % 7 % 2 } Ye = Array.prototype.indexOf ? Array.prototype.indexOf : function (e) { var t; for (t = 0; t < this.length; ++t) if (this[t] === e) return t; return -1 }, I("M", ["MM", 2], "Mo", function () { return this.month() + 1 }), I("MMM", 0, 0, function (e) { return this.localeData().monthsShort(this, e) }), I("MMMM", 0, 0, function (e) { return this.localeData().months(this, e) }), H("month", "M"), L("month", 8), ue("M", B), ue("MM", B, z), ue("MMM", function (e, t) { return t.monthsShortRegex(e) }), ue("MMMM", function (e, t) { return t.monthsRegex(e) }), ce(["M", "MM"], function (e, t) { t[_e] = k(e) - 1 }), ce(["MMM", "MMMM"], function (e, t, n, s) { var i = n._locale.monthsParse(e, s, n._strict); null != i ? t[_e] = i : g(n).invalidMonth = e }); var We = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, He = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"); var Re = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"); function Ce(e, t) { var n; if (!e.isValid()) return e; if ("string" == typeof t) if (/^\d+$/.test(t)) t = k(t); else if (!d(t = e.localeData().monthsParse(t))) return e; return n = Math.min(e.date(), Pe(e.year(), t)), e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, n), e } function Fe(e) { return null != e ? (Ce(this, e), c.updateOffset(this, !0), this) : xe(this, "Month") } var Le = ae; var Ue = ae; function Ne() { function e(e, t) { return t.length - e.length } var t, n, s = [], i = [], r = []; for (t = 0; t < 12; t++) n = y([2e3, t]), s.push(this.monthsShort(n, "")), i.push(this.months(n, "")), r.push(this.months(n, "")), r.push(this.monthsShort(n, "")); for (s.sort(e), i.sort(e), r.sort(e), t = 0; t < 12; t++) s[t] = de(s[t]), i[t] = de(i[t]); for (t = 0; t < 24; t++) r[t] = de(r[t]); this._monthsRegex = new RegExp("^(" + r.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp("^(" + i.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + s.join("|") + ")", "i") } function Ge(e) { var t = new Date(Date.UTC.apply(null, arguments)); return e < 100 && 0 <= e && isFinite(t.getUTCFullYear()) && t.setUTCFullYear(e), t } function Ve(e, t, n) { var s = 7 + t - n; return -((7 + Ge(e, 0, s).getUTCDay() - t) % 7) + s - 1 } function Ee(e, t, n, s, i) { var r, a, o = 1 + 7 * (t - 1) + (7 + n - s) % 7 + Ve(e, s, i); return o <= 0 ? a = De(r = e - 1) + o : o > De(e) ? (r = e + 1, a = o - De(e)) : (r = e, a = o), { year: r, dayOfYear: a } } function Ie(e, t, n) { var s, i, r = Ve(e.year(), t, n), a = Math.floor((e.dayOfYear() - r - 1) / 7) + 1; return a < 1 ? s = a + Ae(i = e.year() - 1, t, n) : a > Ae(e.year(), t, n) ? (s = a - Ae(e.year(), t, n), i = e.year() + 1) : (i = e.year(), s = a), { week: s, year: i } } function Ae(e, t, n) { var s = Ve(e, t, n), i = Ve(e + 1, t, n); return (De(e) - s + i) / 7 } I("w", ["ww", 2], "wo", "week"), I("W", ["WW", 2], "Wo", "isoWeek"), H("week", "w"), H("isoWeek", "W"), L("week", 5), L("isoWeek", 5), ue("w", B), ue("ww", B, z), ue("W", B), ue("WW", B, z), fe(["w", "ww", "W", "WW"], function (e, t, n, s) { t[s.substr(0, 1)] = k(e) }); I("d", 0, "do", "day"), I("dd", 0, 0, function (e) { return this.localeData().weekdaysMin(this, e) }), I("ddd", 0, 0, function (e) { return this.localeData().weekdaysShort(this, e) }), I("dddd", 0, 0, function (e) { return this.localeData().weekdays(this, e) }), I("e", 0, 0, "weekday"), I("E", 0, 0, "isoWeekday"), H("day", "d"), H("weekday", "e"), H("isoWeekday", "E"), L("day", 11), L("weekday", 11), L("isoWeekday", 11), ue("d", B), ue("e", B), ue("E", B), ue("dd", function (e, t) { return t.weekdaysMinRegex(e) }), ue("ddd", function (e, t) { return t.weekdaysShortRegex(e) }), ue("dddd", function (e, t) { return t.weekdaysRegex(e) }), fe(["dd", "ddd", "dddd"], function (e, t, n, s) { var i = n._locale.weekdaysParse(e, s, n._strict); null != i ? t.d = i : g(n).invalidWeekday = e }), fe(["d", "e", "E"], function (e, t, n, s) { t[s] = k(e) }); var je = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"); var Ze = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"); var ze = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"); var $e = ae; var qe = ae; var Je = ae; function Be() { function e(e, t) { return t.length - e.length } var t, n, s, i, r, a = [], o = [], u = [], l = []; for (t = 0; t < 7; t++) n = y([2e3, 1]).day(t), s = this.weekdaysMin(n, ""), i = this.weekdaysShort(n, ""), r = this.weekdays(n, ""), a.push(s), o.push(i), u.push(r), l.push(s), l.push(i), l.push(r); for (a.sort(e), o.sort(e), u.sort(e), l.sort(e), t = 0; t < 7; t++) o[t] = de(o[t]), u[t] = de(u[t]), l[t] = de(l[t]); this._weekdaysRegex = new RegExp("^(" + l.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + u.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + a.join("|") + ")", "i") } function Qe() { return this.hours() % 12 || 12 } function Xe(e, t) { I(e, 0, 0, function () { return this.localeData().meridiem(this.hours(), this.minutes(), t) }) } function Ke(e, t) { return t._meridiemParse } I("H", ["HH", 2], 0, "hour"), I("h", ["hh", 2], 0, Qe), I("k", ["kk", 2], 0, function () { return this.hours() || 24 }), I("hmm", 0, 0, function () { return "" + Qe.apply(this) + U(this.minutes(), 2) }), I("hmmss", 0, 0, function () { return "" + Qe.apply(this) + U(this.minutes(), 2) + U(this.seconds(), 2) }), I("Hmm", 0, 0, function () { return "" + this.hours() + U(this.minutes(), 2) }), I("Hmmss", 0, 0, function () { return "" + this.hours() + U(this.minutes(), 2) + U(this.seconds(), 2) }), Xe("a", !0), Xe("A", !1), H("hour", "h"), L("hour", 13), ue("a", Ke), ue("A", Ke), ue("H", B), ue("h", B), ue("k", B), ue("HH", B, z), ue("hh", B, z), ue("kk", B, z), ue("hmm", Q), ue("hmmss", X), ue("Hmm", Q), ue("Hmmss", X), ce(["H", "HH"], ge), ce(["k", "kk"], function (e, t, n) { var s = k(e); t[ge] = 24 === s ? 0 : s }), ce(["a", "A"], function (e, t, n) { n._isPm = n._locale.isPM(e), n._meridiem = e }), ce(["h", "hh"], function (e, t, n) { t[ge] = k(e), g(n).bigHour = !0 }), ce("hmm", function (e, t, n) { var s = e.length - 2; t[ge] = k(e.substr(0, s)), t[pe] = k(e.substr(s)), g(n).bigHour = !0 }), ce("hmmss", function (e, t, n) { var s = e.length - 4, i = e.length - 2; t[ge] = k(e.substr(0, s)), t[pe] = k(e.substr(s, 2)), t[ve] = k(e.substr(i)), g(n).bigHour = !0 }), ce("Hmm", function (e, t, n) { var s = e.length - 2; t[ge] = k(e.substr(0, s)), t[pe] = k(e.substr(s)) }), ce("Hmmss", function (e, t, n) { var s = e.length - 4, i = e.length - 2; t[ge] = k(e.substr(0, s)), t[pe] = k(e.substr(s, 2)), t[ve] = k(e.substr(i)) }); var et, tt = Te("Hours", !0), nt = { calendar: { sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L" }, longDateFormat: { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, invalidDate: "Invalid date", ordinal: "%d", dayOfMonthOrdinalParse: /\d{1,2}/, relativeTime: { future: "in %s", past: "%s ago", s: "a few seconds", ss: "%d seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" }, months: He, monthsShort: Re, week: { dow: 0, doy: 6 }, weekdays: je, weekdaysMin: ze, weekdaysShort: Ze, meridiemParse: /[ap]\.?m?\.?/i }, st = {}, it = {}; function rt(e) { return e ? e.toLowerCase().replace("_", "-") : e } function at(e) { var t = null; if (!st[e] && "undefined" != typeof module && module && module.exports) try { t = et._abbr, require("./locale/" + e), ot(t) } catch (e) { } return st[e] } function ot(e, t) { var n; return e && ((n = l(t) ? lt(e) : ut(e, t)) ? et = n : "undefined" != typeof console && console.warn && console.warn("Locale " + e + " not found. Did you forget to load it?")), et._abbr } function ut(e, t) { if (null !== t) { var n, s = nt; if (t.abbr = e, null != st[e]) T("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), s = st[e]._config; else if (null != t.parentLocale) if (null != st[t.parentLocale]) s = st[t.parentLocale]._config; else { if (null == (n = at(t.parentLocale))) return it[t.parentLocale] || (it[t.parentLocale] = []), it[t.parentLocale].push({ name: e, config: t }), null; s = n._config } return st[e] = new P(b(s, t)), it[e] && it[e].forEach(function (e) { ut(e.name, e.config) }), ot(e), st[e] } return delete st[e], null } function lt(e) { var t; if (e && e._locale && e._locale._abbr && (e = e._locale._abbr), !e) return et; if (!o(e)) { if (t = at(e)) return t; e = [e] } return function (e) { for (var t, n, s, i, r = 0; r < e.length;) { for (t = (i = rt(e[r]).split("-")).length, n = (n = rt(e[r + 1])) ? n.split("-") : null; 0 < t;) { if (s = at(i.slice(0, t).join("-"))) return s; if (n && n.length >= t && a(i, n, !0) >= t - 1) break; t-- } r++ } return et }(e) } function dt(e) { var t, n = e._a; return n && -2 === g(e).overflow && (t = n[_e] < 0 || 11 < n[_e] ? _e : n[ye] < 1 || n[ye] > Pe(n[me], n[_e]) ? ye : n[ge] < 0 || 24 < n[ge] || 24 === n[ge] && (0 !== n[pe] || 0 !== n[ve] || 0 !== n[we]) ? ge : n[pe] < 0 || 59 < n[pe] ? pe : n[ve] < 0 || 59 < n[ve] ? ve : n[we] < 0 || 999 < n[we] ? we : -1, g(e)._overflowDayOfYear && (t < me || ye < t) && (t = ye), g(e)._overflowWeeks && -1 === t && (t = Me), g(e)._overflowWeekday && -1 === t && (t = Se), g(e).overflow = t), e } function ht(e, t, n) { return null != e ? e : null != t ? t : n } function ct(e) { var t, n, s, i, r, a = []; if (!e._d) { var o, u; for (o = e, u = new Date(c.now()), s = o._useUTC ? [u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate()] : [u.getFullYear(), u.getMonth(), u.getDate()], e._w && null == e._a[ye] && null == e._a[_e] && function (e) { var t, n, s, i, r, a, o, u; if (null != (t = e._w).GG || null != t.W || null != t.E) r = 1, a = 4, n = ht(t.GG, e._a[me], Ie(Tt(), 1, 4).year), s = ht(t.W, 1), ((i = ht(t.E, 1)) < 1 || 7 < i) && (u = !0); else { r = e._locale._week.dow, a = e._locale._week.doy; var l = Ie(Tt(), r, a); n = ht(t.gg, e._a[me], l.year), s = ht(t.w, l.week), null != t.d ? ((i = t.d) < 0 || 6 < i) && (u = !0) : null != t.e ? (i = t.e + r, (t.e < 0 || 6 < t.e) && (u = !0)) : i = r } s < 1 || s > Ae(n, r, a) ? g(e)._overflowWeeks = !0 : null != u ? g(e)._overflowWeekday = !0 : (o = Ee(n, s, i, r, a), e._a[me] = o.year, e._dayOfYear = o.dayOfYear) }(e), null != e._dayOfYear && (r = ht(e._a[me], s[me]), (e._dayOfYear > De(r) || 0 === e._dayOfYear) && (g(e)._overflowDayOfYear = !0), n = Ge(r, 0, e._dayOfYear), e._a[_e] = n.getUTCMonth(), e._a[ye] = n.getUTCDate()), t = 0; t < 3 && null == e._a[t]; ++t) e._a[t] = a[t] = s[t]; for (; t < 7; t++) e._a[t] = a[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t]; 24 === e._a[ge] && 0 === e._a[pe] && 0 === e._a[ve] && 0 === e._a[we] && (e._nextDay = !0, e._a[ge] = 0), e._d = (e._useUTC ? Ge : function (e, t, n, s, i, r, a) { var o = new Date(e, t, n, s, i, r, a); return e < 100 && 0 <= e && isFinite(o.getFullYear()) && o.setFullYear(e), o }).apply(null, a), i = e._useUTC ? e._d.getUTCDay() : e._d.getDay(), null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), e._nextDay && (e._a[ge] = 24), e._w && void 0 !== e._w.d && e._w.d !== i && (g(e).weekdayMismatch = !0) } } var ft = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, mt = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, _t = /Z|[+-]\d\d(?::?\d\d)?/, yt = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, !1], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, !1], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, !1], ["YYYYDDD", /\d{7}/]], gt = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]], pt = /^\/?Date\((\-?\d+)/i; function vt(e) { var t, n, s, i, r, a, o = e._i, u = ft.exec(o) || mt.exec(o); if (u) { for (g(e).iso = !0, t = 0, n = yt.length; t < n; t++) if (yt[t][1].exec(u[1])) { i = yt[t][0], s = !1 !== yt[t][2]; break } if (null == i) return void (e._isValid = !1); if (u[3]) { for (t = 0, n = gt.length; t < n; t++) if (gt[t][1].exec(u[3])) { r = (u[2] || " ") + gt[t][0]; break } if (null == r) return void (e._isValid = !1) } if (!s && null != r) return void (e._isValid = !1); if (u[4]) { if (!_t.exec(u[4])) return void (e._isValid = !1); a = "Z" } e._f = i + (r || "") + (a || ""), kt(e) } else e._isValid = !1 } var wt = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/; function Mt(e, t, n, s, i, r) { var a = [function (e) { var t = parseInt(e, 10); { if (t <= 49) return 2e3 + t; if (t <= 999) return 1900 + t } return t }(e), Re.indexOf(t), parseInt(n, 10), parseInt(s, 10), parseInt(i, 10)]; return r && a.push(parseInt(r, 10)), a } var St = { UT: 0, GMT: 0, EDT: -240, EST: -300, CDT: -300, CST: -360, MDT: -360, MST: -420, PDT: -420, PST: -480 }; function Dt(e) { var t, n, s, i = wt.exec(e._i.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "")); if (i) { var r = Mt(i[4], i[3], i[2], i[5], i[6], i[7]); if (t = i[1], n = r, s = e, t && Ze.indexOf(t) !== new Date(n[0], n[1], n[2]).getDay() && (g(s).weekdayMismatch = !0, !(s._isValid = !1))) return; e._a = r, e._tzm = function (e, t, n) { if (e) return St[e]; if (t) return 0; var s = parseInt(n, 10), i = s % 100; return (s - i) / 100 * 60 + i }(i[8], i[9], i[10]), e._d = Ge.apply(null, e._a), e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), g(e).rfc2822 = !0 } else e._isValid = !1 } function kt(e) { if (e._f !== c.ISO_8601) if (e._f !== c.RFC_2822) { e._a = [], g(e).empty = !0; var t, n, s, i, r, a, o, u, l = "" + e._i, d = l.length, h = 0; for (s = j(e._f, e._locale).match(N) || [], t = 0; t < s.length; t++) i = s[t], (n = (l.match(le(i, e)) || [])[0]) && (0 < (r = l.substr(0, l.indexOf(n))).length && g(e).unusedInput.push(r), l = l.slice(l.indexOf(n) + n.length), h += n.length), E[i] ? (n ? g(e).empty = !1 : g(e).unusedTokens.push(i), a = i, u = e, null != (o = n) && m(he, a) && he[a](o, u._a, u, a)) : e._strict && !n && g(e).unusedTokens.push(i); g(e).charsLeftOver = d - h, 0 < l.length && g(e).unusedInput.push(l), e._a[ge] <= 12 && !0 === g(e).bigHour && 0 < e._a[ge] && (g(e).bigHour = void 0), g(e).parsedDateParts = e._a.slice(0), g(e).meridiem = e._meridiem, e._a[ge] = function (e, t, n) { var s; if (null == n) return t; return null != e.meridiemHour ? e.meridiemHour(t, n) : (null != e.isPM && ((s = e.isPM(n)) && t < 12 && (t += 12), s || 12 !== t || (t = 0)), t) }(e._locale, e._a[ge], e._meridiem), ct(e), dt(e) } else Dt(e); else vt(e) } function Yt(e) { var t, n, s, i, r = e._i, a = e._f; return e._locale = e._locale || lt(e._l), null === r || void 0 === a && "" === r ? v({ nullInput: !0 }) : ("string" == typeof r && (e._i = r = e._locale.preparse(r)), S(r) ? new M(dt(r)) : (h(r) ? e._d = r : o(a) ? function (e) { var t, n, s, i, r; if (0 === e._f.length) return g(e).invalidFormat = !0, e._d = new Date(NaN); for (i = 0; i < e._f.length; i++) r = 0, t = w({}, e), null != e._useUTC && (t._useUTC = e._useUTC), t._f = e._f[i], kt(t), p(t) && (r += g(t).charsLeftOver, r += 10 * g(t).unusedTokens.length, g(t).score = r, (null == s || r < s) && (s = r, n = t)); _(e, n || t) }(e) : a ? kt(e) : l(n = (t = e)._i) ? t._d = new Date(c.now()) : h(n) ? t._d = new Date(n.valueOf()) : "string" == typeof n ? (s = t, null === (i = pt.exec(s._i)) ? (vt(s), !1 === s._isValid && (delete s._isValid, Dt(s), !1 === s._isValid && (delete s._isValid, c.createFromInputFallback(s)))) : s._d = new Date(+i[1])) : o(n) ? (t._a = f(n.slice(0), function (e) { return parseInt(e, 10) }), ct(t)) : u(n) ? function (e) { if (!e._d) { var t = C(e._i); e._a = f([t.year, t.month, t.day || t.date, t.hour, t.minute, t.second, t.millisecond], function (e) { return e && parseInt(e, 10) }), ct(e) } }(t) : d(n) ? t._d = new Date(n) : c.createFromInputFallback(t), p(e) || (e._d = null), e)) } function Ot(e, t, n, s, i) { var r, a = {}; return !0 !== n && !1 !== n || (s = n, n = void 0), (u(e) && function (e) { if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(e).length; var t; for (t in e) if (e.hasOwnProperty(t)) return !1; return !0 }(e) || o(e) && 0 === e.length) && (e = void 0), a._isAMomentObject = !0, a._useUTC = a._isUTC = i, a._l = n, a._i = e, a._f = t, a._strict = s, (r = new M(dt(Yt(a))))._nextDay && (r.add(1, "d"), r._nextDay = void 0), r } function Tt(e, t, n, s) { return Ot(e, t, n, s, !1) } c.createFromInputFallback = n("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function (e) { e._d = new Date(e._i + (e._useUTC ? " UTC" : "")) }), c.ISO_8601 = function () { }, c.RFC_2822 = function () { }; var xt = n("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function () { var e = Tt.apply(null, arguments); return this.isValid() && e.isValid() ? e < this ? this : e : v() }), bt = n("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function () { var e = Tt.apply(null, arguments); return this.isValid() && e.isValid() ? this < e ? this : e : v() }); function Pt(e, t) { var n, s; if (1 === t.length && o(t[0]) && (t = t[0]), !t.length) return Tt(); for (n = t[0], s = 1; s < t.length; ++s) t[s].isValid() && !t[s][e](n) || (n = t[s]); return n } var Wt = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"]; function Ht(e) { var t = C(e), n = t.year || 0, s = t.quarter || 0, i = t.month || 0, r = t.week || 0, a = t.day || 0, o = t.hour || 0, u = t.minute || 0, l = t.second || 0, d = t.millisecond || 0; this._isValid = function (e) { for (var t in e) if (-1 === Ye.call(Wt, t) || null != e[t] && isNaN(e[t])) return !1; for (var n = !1, s = 0; s < Wt.length; ++s) if (e[Wt[s]]) { if (n) return !1; parseFloat(e[Wt[s]]) !== k(e[Wt[s]]) && (n = !0) } return !0 }(t), this._milliseconds = +d + 1e3 * l + 6e4 * u + 1e3 * o * 60 * 60, this._days = +a + 7 * r, this._months = +i + 3 * s + 12 * n, this._data = {}, this._locale = lt(), this._bubble() } function Rt(e) { return e instanceof Ht } function Ct(e) { return e < 0 ? -1 * Math.round(-1 * e) : Math.round(e) } function Ft(e, n) { I(e, 0, 0, function () { var e = this.utcOffset(), t = "+"; return e < 0 && (e = -e, t = "-"), t + U(~~(e / 60), 2) + n + U(~~e % 60, 2) }) } Ft("Z", ":"), Ft("ZZ", ""), ue("Z", re), ue("ZZ", re), ce(["Z", "ZZ"], function (e, t, n) { n._useUTC = !0, n._tzm = Ut(re, e) }); var Lt = /([\+\-]|\d\d)/gi; function Ut(e, t) { var n = (t || "").match(e); if (null === n) return null; var s = ((n[n.length - 1] || []) + "").match(Lt) || ["-", 0, 0], i = 60 * s[1] + k(s[2]); return 0 === i ? 0 : "+" === s[0] ? i : -i } function Nt(e, t) { var n, s; return t._isUTC ? (n = t.clone(), s = (S(e) || h(e) ? e.valueOf() : Tt(e).valueOf()) - n.valueOf(), n._d.setTime(n._d.valueOf() + s), c.updateOffset(n, !1), n) : Tt(e).local() } function Gt(e) { return 15 * -Math.round(e._d.getTimezoneOffset() / 15) } function Vt() { return !!this.isValid() && (this._isUTC && 0 === this._offset) } c.updateOffset = function () { }; var Et = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/, It = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/; function At(e, t) { var n, s, i, r = e, a = null; return Rt(e) ? r = { ms: e._milliseconds, d: e._days, M: e._months } : d(e) ? (r = {}, t ? r[t] = e : r.milliseconds = e) : (a = Et.exec(e)) ? (n = "-" === a[1] ? -1 : 1, r = { y: 0, d: k(a[ye]) * n, h: k(a[ge]) * n, m: k(a[pe]) * n, s: k(a[ve]) * n, ms: k(Ct(1e3 * a[we])) * n }) : (a = It.exec(e)) ? (n = "-" === a[1] ? -1 : (a[1], 1), r = { y: jt(a[2], n), M: jt(a[3], n), w: jt(a[4], n), d: jt(a[5], n), h: jt(a[6], n), m: jt(a[7], n), s: jt(a[8], n) }) : null == r ? r = {} : "object" == typeof r && ("from" in r || "to" in r) && (i = function (e, t) { var n; if (!e.isValid() || !t.isValid()) return { milliseconds: 0, months: 0 }; t = Nt(t, e), e.isBefore(t) ? n = Zt(e, t) : ((n = Zt(t, e)).milliseconds = -n.milliseconds, n.months = -n.months); return n }(Tt(r.from), Tt(r.to)), (r = {}).ms = i.milliseconds, r.M = i.months), s = new Ht(r), Rt(e) && m(e, "_locale") && (s._locale = e._locale), s } function jt(e, t) { var n = e && parseFloat(e.replace(",", ".")); return (isNaN(n) ? 0 : n) * t } function Zt(e, t) { var n = { milliseconds: 0, months: 0 }; return n.months = t.month() - e.month() + 12 * (t.year() - e.year()), e.clone().add(n.months, "M").isAfter(t) && --n.months, n.milliseconds = +t - +e.clone().add(n.months, "M"), n } function zt(s, i) { return function (e, t) { var n; return null === t || isNaN(+t) || (T(i, "moment()." + i + "(period, number) is deprecated. Please use moment()." + i + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), n = e, e = t, t = n), $t(this, At(e = "string" == typeof e ? +e : e, t), s), this } } function $t(e, t, n, s) { var i = t._milliseconds, r = Ct(t._days), a = Ct(t._months); e.isValid() && (s = null == s || s, a && Ce(e, xe(e, "Month") + a * n), r && be(e, "Date", xe(e, "Date") + r * n), i && e._d.setTime(e._d.valueOf() + i * n), s && c.updateOffset(e, r || a)) } At.fn = Ht.prototype, At.invalid = function () { return At(NaN) }; var qt = zt(1, "add"), Jt = zt(-1, "subtract"); function Bt(e, t) { var n = 12 * (t.year() - e.year()) + (t.month() - e.month()), s = e.clone().add(n, "months"); return -(n + (t - s < 0 ? (t - s) / (s - e.clone().add(n - 1, "months")) : (t - s) / (e.clone().add(n + 1, "months") - s))) || 0 } function Qt(e) { var t; return void 0 === e ? this._locale._abbr : (null != (t = lt(e)) && (this._locale = t), this) } c.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", c.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]"; var Xt = n("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (e) { return void 0 === e ? this.localeData() : this.locale(e) }); function Kt() { return this._locale } function en(e, t) { I(0, [e, e.length], 0, t) } function tn(e, t, n, s, i) { var r; return null == e ? Ie(this, s, i).year : ((r = Ae(e, s, i)) < t && (t = r), function (e, t, n, s, i) { var r = Ee(e, t, n, s, i), a = Ge(r.year, 0, r.dayOfYear); return this.year(a.getUTCFullYear()), this.month(a.getUTCMonth()), this.date(a.getUTCDate()), this }.call(this, e, t, n, s, i)) } I(0, ["gg", 2], 0, function () { return this.weekYear() % 100 }), I(0, ["GG", 2], 0, function () { return this.isoWeekYear() % 100 }), en("gggg", "weekYear"), en("ggggg", "weekYear"), en("GGGG", "isoWeekYear"), en("GGGGG", "isoWeekYear"), H("weekYear", "gg"), H("isoWeekYear", "GG"), L("weekYear", 1), L("isoWeekYear", 1), ue("G", se), ue("g", se), ue("GG", B, z), ue("gg", B, z), ue("GGGG", ee, q), ue("gggg", ee, q), ue("GGGGG", te, J), ue("ggggg", te, J), fe(["gggg", "ggggg", "GGGG", "GGGGG"], function (e, t, n, s) { t[s.substr(0, 2)] = k(e) }), fe(["gg", "GG"], function (e, t, n, s) { t[s] = c.parseTwoDigitYear(e) }), I("Q", 0, "Qo", "quarter"), H("quarter", "Q"), L("quarter", 7), ue("Q", Z), ce("Q", function (e, t) { t[_e] = 3 * (k(e) - 1) }), I("D", ["DD", 2], "Do", "date"), H("date", "D"), L("date", 9), ue("D", B), ue("DD", B, z), ue("Do", function (e, t) { return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient }), ce(["D", "DD"], ye), ce("Do", function (e, t) { t[ye] = k(e.match(B)[0]) }); var nn = Te("Date", !0); I("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), H("dayOfYear", "DDD"), L("dayOfYear", 4), ue("DDD", K), ue("DDDD", $), ce(["DDD", "DDDD"], function (e, t, n) { n._dayOfYear = k(e) }), I("m", ["mm", 2], 0, "minute"), H("minute", "m"), L("minute", 14), ue("m", B), ue("mm", B, z), ce(["m", "mm"], pe); var sn = Te("Minutes", !1); I("s", ["ss", 2], 0, "second"), H("second", "s"), L("second", 15), ue("s", B), ue("ss", B, z), ce(["s", "ss"], ve); var rn, an = Te("Seconds", !1); for (I("S", 0, 0, function () { return ~~(this.millisecond() / 100) }), I(0, ["SS", 2], 0, function () { return ~~(this.millisecond() / 10) }), I(0, ["SSS", 3], 0, "millisecond"), I(0, ["SSSS", 4], 0, function () { return 10 * this.millisecond() }), I(0, ["SSSSS", 5], 0, function () { return 100 * this.millisecond() }), I(0, ["SSSSSS", 6], 0, function () { return 1e3 * this.millisecond() }), I(0, ["SSSSSSS", 7], 0, function () { return 1e4 * this.millisecond() }), I(0, ["SSSSSSSS", 8], 0, function () { return 1e5 * this.millisecond() }), I(0, ["SSSSSSSSS", 9], 0, function () { return 1e6 * this.millisecond() }), H("millisecond", "ms"), L("millisecond", 16), ue("S", K, Z), ue("SS", K, z), ue("SSS", K, $), rn = "SSSS"; rn.length <= 9; rn += "S") ue(rn, ne); function on(e, t) { t[we] = k(1e3 * ("0." + e)) } for (rn = "S"; rn.length <= 9; rn += "S") ce(rn, on); var un = Te("Milliseconds", !1); I("z", 0, 0, "zoneAbbr"), I("zz", 0, 0, "zoneName"); var ln = M.prototype; function dn(e) { return e } ln.add = qt, ln.calendar = function (e, t) { var n = e || Tt(), s = Nt(n, this).startOf("day"), i = c.calendarFormat(this, s) || "sameElse", r = t && (x(t[i]) ? t[i].call(this, n) : t[i]); return this.format(r || this.localeData().calendar(i, this, Tt(n))) }, ln.clone = function () { return new M(this) }, ln.diff = function (e, t, n) { var s, i, r; if (!this.isValid()) return NaN; if (!(s = Nt(e, this)).isValid()) return NaN; switch (i = 6e4 * (s.utcOffset() - this.utcOffset()), t = R(t)) { case "year": r = Bt(this, s) / 12; break; case "month": r = Bt(this, s); break; case "quarter": r = Bt(this, s) / 3; break; case "second": r = (this - s) / 1e3; break; case "minute": r = (this - s) / 6e4; break; case "hour": r = (this - s) / 36e5; break; case "day": r = (this - s - i) / 864e5; break; case "week": r = (this - s - i) / 6048e5; break; default: r = this - s } return n ? r : D(r) }, ln.endOf = function (e) { return void 0 === (e = R(e)) || "millisecond" === e ? this : ("date" === e && (e = "day"), this.startOf(e).add(1, "isoWeek" === e ? "week" : e).subtract(1, "ms")) }, ln.format = function (e) { e || (e = this.isUtc() ? c.defaultFormatUtc : c.defaultFormat); var t = A(this, e); return this.localeData().postformat(t) }, ln.from = function (e, t) { return this.isValid() && (S(e) && e.isValid() || Tt(e).isValid()) ? At({ to: this, from: e }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate() }, ln.fromNow = function (e) { return this.from(Tt(), e) }, ln.to = function (e, t) { return this.isValid() && (S(e) && e.isValid() || Tt(e).isValid()) ? At({ from: this, to: e }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate() }, ln.toNow = function (e) { return this.to(Tt(), e) }, ln.get = function (e) { return x(this[e = R(e)]) ? this[e]() : this }, ln.invalidAt = function () { return g(this).overflow }, ln.isAfter = function (e, t) { var n = S(e) ? e : Tt(e); return !(!this.isValid() || !n.isValid()) && ("millisecond" === (t = R(l(t) ? "millisecond" : t)) ? this.valueOf() > n.valueOf() : n.valueOf() < this.clone().startOf(t).valueOf()) }, ln.isBefore = function (e, t) { var n = S(e) ? e : Tt(e); return !(!this.isValid() || !n.isValid()) && ("millisecond" === (t = R(l(t) ? "millisecond" : t)) ? this.valueOf() < n.valueOf() : this.clone().endOf(t).valueOf() < n.valueOf()) }, ln.isBetween = function (e, t, n, s) { return ("(" === (s = s || "()")[0] ? this.isAfter(e, n) : !this.isBefore(e, n)) && (")" === s[1] ? this.isBefore(t, n) : !this.isAfter(t, n)) }, ln.isSame = function (e, t) { var n, s = S(e) ? e : Tt(e); return !(!this.isValid() || !s.isValid()) && ("millisecond" === (t = R(t || "millisecond")) ? this.valueOf() === s.valueOf() : (n = s.valueOf(), this.clone().startOf(t).valueOf() <= n && n <= this.clone().endOf(t).valueOf())) }, ln.isSameOrAfter = function (e, t) { return this.isSame(e, t) || this.isAfter(e, t) }, ln.isSameOrBefore = function (e, t) { return this.isSame(e, t) || this.isBefore(e, t) }, ln.isValid = function () { return p(this) }, ln.lang = Xt, ln.locale = Qt, ln.localeData = Kt, ln.max = bt, ln.min = xt, ln.parsingFlags = function () { return _({}, g(this)) }, ln.set = function (e, t) { if ("object" == typeof e) for (var n = function (e) { var t = []; for (var n in e) t.push({ unit: n, priority: F[n] }); return t.sort(function (e, t) { return e.priority - t.priority }), t }(e = C(e)), s = 0; s < n.length; s++) this[n[s].unit](e[n[s].unit]); else if (x(this[e = R(e)])) return this[e](t); return this }, ln.startOf = function (e) { switch (e = R(e)) { case "year": this.month(0); case "quarter": case "month": this.date(1); case "week": case "isoWeek": case "day": case "date": this.hours(0); case "hour": this.minutes(0); case "minute": this.seconds(0); case "second": this.milliseconds(0) } return "week" === e && this.weekday(0), "isoWeek" === e && this.isoWeekday(1), "quarter" === e && this.month(3 * Math.floor(this.month() / 3)), this }, ln.subtract = Jt, ln.toArray = function () { var e = this; return [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond()] }, ln.toObject = function () { var e = this; return { years: e.year(), months: e.month(), date: e.date(), hours: e.hours(), minutes: e.minutes(), seconds: e.seconds(), milliseconds: e.milliseconds() } }, ln.toDate = function () { return new Date(this.valueOf()) }, ln.toISOString = function (e) { if (!this.isValid()) return null; var t = !0 !== e, n = t ? this.clone().utc() : this; return n.year() < 0 || 9999 < n.year() ? A(n, t ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : x(Date.prototype.toISOString) ? t ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", A(n, "Z")) : A(n, t ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ") }, ln.inspect = function () { if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)"; var e = "moment", t = ""; this.isLocal() || (e = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", t = "Z"); var n = "[" + e + '("]', s = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY", i = t + '[")]'; return this.format(n + s + "-MM-DD[T]HH:mm:ss.SSS" + i) }, ln.toJSON = function () { return this.isValid() ? this.toISOString() : null }, ln.toString = function () { return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ") }, ln.unix = function () { return Math.floor(this.valueOf() / 1e3) }, ln.valueOf = function () { return this._d.valueOf() - 6e4 * (this._offset || 0) }, ln.creationData = function () { return { input: this._i, format: this._f, locale: this._locale, isUTC: this._isUTC, strict: this._strict } }, ln.year = Oe, ln.isLeapYear = function () { return ke(this.year()) }, ln.weekYear = function (e) { return tn.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy) }, ln.isoWeekYear = function (e) { return tn.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4) }, ln.quarter = ln.quarters = function (e) { return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3) }, ln.month = Fe, ln.daysInMonth = function () { return Pe(this.year(), this.month()) }, ln.week = ln.weeks = function (e) { var t = this.localeData().week(this); return null == e ? t : this.add(7 * (e - t), "d") }, ln.isoWeek = ln.isoWeeks = function (e) { var t = Ie(this, 1, 4).week; return null == e ? t : this.add(7 * (e - t), "d") }, ln.weeksInYear = function () { var e = this.localeData()._week; return Ae(this.year(), e.dow, e.doy) }, ln.isoWeeksInYear = function () { return Ae(this.year(), 1, 4) }, ln.date = nn, ln.day = ln.days = function (e) { if (!this.isValid()) return null != e ? this : NaN; var t, n, s = this._isUTC ? this._d.getUTCDay() : this._d.getDay(); return null != e ? (t = e, n = this.localeData(), e = "string" != typeof t ? t : isNaN(t) ? "number" == typeof (t = n.weekdaysParse(t)) ? t : null : parseInt(t, 10), this.add(e - s, "d")) : s }, ln.weekday = function (e) { if (!this.isValid()) return null != e ? this : NaN; var t = (this.day() + 7 - this.localeData()._week.dow) % 7; return null == e ? t : this.add(e - t, "d") }, ln.isoWeekday = function (e) { if (!this.isValid()) return null != e ? this : NaN; if (null != e) { var t = (n = e, s = this.localeData(), "string" == typeof n ? s.weekdaysParse(n) % 7 || 7 : isNaN(n) ? null : n); return this.day(this.day() % 7 ? t : t - 7) } return this.day() || 7; var n, s }, ln.dayOfYear = function (e) { var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1; return null == e ? t : this.add(e - t, "d") }, ln.hour = ln.hours = tt, ln.minute = ln.minutes = sn, ln.second = ln.seconds = an, ln.millisecond = ln.milliseconds = un, ln.utcOffset = function (e, t, n) { var s, i = this._offset || 0; if (!this.isValid()) return null != e ? this : NaN; if (null != e) { if ("string" == typeof e) { if (null === (e = Ut(re, e))) return this } else Math.abs(e) < 16 && !n && (e *= 60); return !this._isUTC && t && (s = Gt(this)), this._offset = e, this._isUTC = !0, null != s && this.add(s, "m"), i !== e && (!t || this._changeInProgress ? $t(this, At(e - i, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, c.updateOffset(this, !0), this._changeInProgress = null)), this } return this._isUTC ? i : Gt(this) }, ln.utc = function (e) { return this.utcOffset(0, e) }, ln.local = function (e) { return this._isUTC && (this.utcOffset(0, e), this._isUTC = !1, e && this.subtract(Gt(this), "m")), this }, ln.parseZone = function () { if (null != this._tzm) this.utcOffset(this._tzm, !1, !0); else if ("string" == typeof this._i) { var e = Ut(ie, this._i); null != e ? this.utcOffset(e) : this.utcOffset(0, !0) } return this }, ln.hasAlignedHourOffset = function (e) { return !!this.isValid() && (e = e ? Tt(e).utcOffset() : 0, (this.utcOffset() - e) % 60 == 0) }, ln.isDST = function () { return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset() }, ln.isLocal = function () { return !!this.isValid() && !this._isUTC }, ln.isUtcOffset = function () { return !!this.isValid() && this._isUTC }, ln.isUtc = Vt, ln.isUTC = Vt, ln.zoneAbbr = function () { return this._isUTC ? "UTC" : "" }, ln.zoneName = function () { return this._isUTC ? "Coordinated Universal Time" : "" }, ln.dates = n("dates accessor is deprecated. Use date instead.", nn), ln.months = n("months accessor is deprecated. Use month instead", Fe), ln.years = n("years accessor is deprecated. Use year instead", Oe), ln.zone = n("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", function (e, t) { return null != e ? ("string" != typeof e && (e = -e), this.utcOffset(e, t), this) : -this.utcOffset() }), ln.isDSTShifted = n("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", function () { if (!l(this._isDSTShifted)) return this._isDSTShifted; var e = {}; if (w(e, this), (e = Yt(e))._a) { var t = e._isUTC ? y(e._a) : Tt(e._a); this._isDSTShifted = this.isValid() && 0 < a(e._a, t.toArray()) } else this._isDSTShifted = !1; return this._isDSTShifted }); var hn = P.prototype; function cn(e, t, n, s) { var i = lt(), r = y().set(s, t); return i[n](r, e) } function fn(e, t, n) { if (d(e) && (t = e, e = void 0), e = e || "", null != t) return cn(e, t, n, "month"); var s, i = []; for (s = 0; s < 12; s++) i[s] = cn(e, s, n, "month"); return i } function mn(e, t, n, s) { "boolean" == typeof e ? d(t) && (n = t, t = void 0) : (t = e, e = !1, d(n = t) && (n = t, t = void 0)), t = t || ""; var i, r = lt(), a = e ? r._week.dow : 0; if (null != n) return cn(t, (n + a) % 7, s, "day"); var o = []; for (i = 0; i < 7; i++) o[i] = cn(t, (i + a) % 7, s, "day"); return o } hn.calendar = function (e, t, n) { var s = this._calendar[e] || this._calendar.sameElse; return x(s) ? s.call(t, n) : s }, hn.longDateFormat = function (e) { var t = this._longDateFormat[e], n = this._longDateFormat[e.toUpperCase()]; return t || !n ? t : (this._longDateFormat[e] = n.replace(/MMMM|MM|DD|dddd/g, function (e) { return e.slice(1) }), this._longDateFormat[e]) }, hn.invalidDate = function () { return this._invalidDate }, hn.ordinal = function (e) { return this._ordinal.replace("%d", e) }, hn.preparse = dn, hn.postformat = dn, hn.relativeTime = function (e, t, n, s) { var i = this._relativeTime[n]; return x(i) ? i(e, t, n, s) : i.replace(/%d/i, e) }, hn.pastFuture = function (e, t) { var n = this._relativeTime[0 < e ? "future" : "past"]; return x(n) ? n(t) : n.replace(/%s/i, t) }, hn.set = function (e) { var t, n; for (n in e) x(t = e[n]) ? this[n] = t : this["_" + n] = t; this._config = e, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source) }, hn.months = function (e, t) { return e ? o(this._months) ? this._months[e.month()] : this._months[(this._months.isFormat || We).test(t) ? "format" : "standalone"][e.month()] : o(this._months) ? this._months : this._months.standalone }, hn.monthsShort = function (e, t) { return e ? o(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[We.test(t) ? "format" : "standalone"][e.month()] : o(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone }, hn.monthsParse = function (e, t, n) { var s, i, r; if (this._monthsParseExact) return function (e, t, n) { var s, i, r, a = e.toLocaleLowerCase(); if (!this._monthsParse) for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], s = 0; s < 12; ++s) r = y([2e3, s]), this._shortMonthsParse[s] = this.monthsShort(r, "").toLocaleLowerCase(), this._longMonthsParse[s] = this.months(r, "").toLocaleLowerCase(); return n ? "MMM" === t ? -1 !== (i = Ye.call(this._shortMonthsParse, a)) ? i : null : -1 !== (i = Ye.call(this._longMonthsParse, a)) ? i : null : "MMM" === t ? -1 !== (i = Ye.call(this._shortMonthsParse, a)) ? i : -1 !== (i = Ye.call(this._longMonthsParse, a)) ? i : null : -1 !== (i = Ye.call(this._longMonthsParse, a)) ? i : -1 !== (i = Ye.call(this._shortMonthsParse, a)) ? i : null }.call(this, e, t, n); for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), s = 0; s < 12; s++) { if (i = y([2e3, s]), n && !this._longMonthsParse[s] && (this._longMonthsParse[s] = new RegExp("^" + this.months(i, "").replace(".", "") + "$", "i"), this._shortMonthsParse[s] = new RegExp("^" + this.monthsShort(i, "").replace(".", "") + "$", "i")), n || this._monthsParse[s] || (r = "^" + this.months(i, "") + "|^" + this.monthsShort(i, ""), this._monthsParse[s] = new RegExp(r.replace(".", ""), "i")), n && "MMMM" === t && this._longMonthsParse[s].test(e)) return s; if (n && "MMM" === t && this._shortMonthsParse[s].test(e)) return s; if (!n && this._monthsParse[s].test(e)) return s } }, hn.monthsRegex = function (e) { return this._monthsParseExact ? (m(this, "_monthsRegex") || Ne.call(this), e ? this._monthsStrictRegex : this._monthsRegex) : (m(this, "_monthsRegex") || (this._monthsRegex = Ue), this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex) }, hn.monthsShortRegex = function (e) { return this._monthsParseExact ? (m(this, "_monthsRegex") || Ne.call(this), e ? this._monthsShortStrictRegex : this._monthsShortRegex) : (m(this, "_monthsShortRegex") || (this._monthsShortRegex = Le), this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex) }, hn.week = function (e) { return Ie(e, this._week.dow, this._week.doy).week }, hn.firstDayOfYear = function () { return this._week.doy }, hn.firstDayOfWeek = function () { return this._week.dow }, hn.weekdays = function (e, t) { return e ? o(this._weekdays) ? this._weekdays[e.day()] : this._weekdays[this._weekdays.isFormat.test(t) ? "format" : "standalone"][e.day()] : o(this._weekdays) ? this._weekdays : this._weekdays.standalone }, hn.weekdaysMin = function (e) { return e ? this._weekdaysMin[e.day()] : this._weekdaysMin }, hn.weekdaysShort = function (e) { return e ? this._weekdaysShort[e.day()] : this._weekdaysShort }, hn.weekdaysParse = function (e, t, n) { var s, i, r; if (this._weekdaysParseExact) return function (e, t, n) { var s, i, r, a = e.toLocaleLowerCase(); if (!this._weekdaysParse) for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], s = 0; s < 7; ++s) r = y([2e3, 1]).day(s), this._minWeekdaysParse[s] = this.weekdaysMin(r, "").toLocaleLowerCase(), this._shortWeekdaysParse[s] = this.weekdaysShort(r, "").toLocaleLowerCase(), this._weekdaysParse[s] = this.weekdays(r, "").toLocaleLowerCase(); return n ? "dddd" === t ? -1 !== (i = Ye.call(this._weekdaysParse, a)) ? i : null : "ddd" === t ? -1 !== (i = Ye.call(this._shortWeekdaysParse, a)) ? i : null : -1 !== (i = Ye.call(this._minWeekdaysParse, a)) ? i : null : "dddd" === t ? -1 !== (i = Ye.call(this._weekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._shortWeekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._minWeekdaysParse, a)) ? i : null : "ddd" === t ? -1 !== (i = Ye.call(this._shortWeekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._weekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._minWeekdaysParse, a)) ? i : null : -1 !== (i = Ye.call(this._minWeekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._weekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._shortWeekdaysParse, a)) ? i : null }.call(this, e, t, n); for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), s = 0; s < 7; s++) { if (i = y([2e3, 1]).day(s), n && !this._fullWeekdaysParse[s] && (this._fullWeekdaysParse[s] = new RegExp("^" + this.weekdays(i, "").replace(".", "\\.?") + "$", "i"), this._shortWeekdaysParse[s] = new RegExp("^" + this.weekdaysShort(i, "").replace(".", "\\.?") + "$", "i"), this._minWeekdaysParse[s] = new RegExp("^" + this.weekdaysMin(i, "").replace(".", "\\.?") + "$", "i")), this._weekdaysParse[s] || (r = "^" + this.weekdays(i, "") + "|^" + this.weekdaysShort(i, "") + "|^" + this.weekdaysMin(i, ""), this._weekdaysParse[s] = new RegExp(r.replace(".", ""), "i")), n && "dddd" === t && this._fullWeekdaysParse[s].test(e)) return s; if (n && "ddd" === t && this._shortWeekdaysParse[s].test(e)) return s; if (n && "dd" === t && this._minWeekdaysParse[s].test(e)) return s; if (!n && this._weekdaysParse[s].test(e)) return s } }, hn.weekdaysRegex = function (e) { return this._weekdaysParseExact ? (m(this, "_weekdaysRegex") || Be.call(this), e ? this._weekdaysStrictRegex : this._weekdaysRegex) : (m(this, "_weekdaysRegex") || (this._weekdaysRegex = $e), this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex) }, hn.weekdaysShortRegex = function (e) { return this._weekdaysParseExact ? (m(this, "_weekdaysRegex") || Be.call(this), e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (m(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = qe), this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) }, hn.weekdaysMinRegex = function (e) { return this._weekdaysParseExact ? (m(this, "_weekdaysRegex") || Be.call(this), e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (m(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Je), this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) }, hn.isPM = function (e) { return "p" === (e + "").toLowerCase().charAt(0) }, hn.meridiem = function (e, t, n) { return 11 < e ? n ? "pm" : "PM" : n ? "am" : "AM" }, ot("en", { dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/, ordinal: function (e) { var t = e % 10; return e + (1 === k(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th") } }), c.lang = n("moment.lang is deprecated. Use moment.locale instead.", ot), c.langData = n("moment.langData is deprecated. Use moment.localeData instead.", lt); var _n = Math.abs; function yn(e, t, n, s) { var i = At(t, n); return e._milliseconds += s * i._milliseconds, e._days += s * i._days, e._months += s * i._months, e._bubble() } function gn(e) { return e < 0 ? Math.floor(e) : Math.ceil(e) } function pn(e) { return 4800 * e / 146097 } function vn(e) { return 146097 * e / 4800 } function wn(e) { return function () { return this.as(e) } } var Mn = wn("ms"), Sn = wn("s"), Dn = wn("m"), kn = wn("h"), Yn = wn("d"), On = wn("w"), Tn = wn("M"), xn = wn("y"); function bn(e) { return function () { return this.isValid() ? this._data[e] : NaN } } var Pn = bn("milliseconds"), Wn = bn("seconds"), Hn = bn("minutes"), Rn = bn("hours"), Cn = bn("days"), Fn = bn("months"), Ln = bn("years"); var Un = Math.round, Nn = { ss: 44, s: 45, m: 45, h: 22, d: 26, M: 11 }; var Gn = Math.abs; function Vn(e) { return (0 < e) - (e < 0) || +e } function En() { if (!this.isValid()) return this.localeData().invalidDate(); var e, t, n = Gn(this._milliseconds) / 1e3, s = Gn(this._days), i = Gn(this._months); t = D((e = D(n / 60)) / 60), n %= 60, e %= 60; var r = D(i / 12), a = i %= 12, o = s, u = t, l = e, d = n ? n.toFixed(3).replace(/\.?0+$/, "") : "", h = this.asSeconds(); if (!h) return "P0D"; var c = h < 0 ? "-" : "", f = Vn(this._months) !== Vn(h) ? "-" : "", m = Vn(this._days) !== Vn(h) ? "-" : "", _ = Vn(this._milliseconds) !== Vn(h) ? "-" : ""; return c + "P" + (r ? f + r + "Y" : "") + (a ? f + a + "M" : "") + (o ? m + o + "D" : "") + (u || l || d ? "T" : "") + (u ? _ + u + "H" : "") + (l ? _ + l + "M" : "") + (d ? _ + d + "S" : "") } var In = Ht.prototype; return In.isValid = function () { return this._isValid }, In.abs = function () { var e = this._data; return this._milliseconds = _n(this._milliseconds), this._days = _n(this._days), this._months = _n(this._months), e.milliseconds = _n(e.milliseconds), e.seconds = _n(e.seconds), e.minutes = _n(e.minutes), e.hours = _n(e.hours), e.months = _n(e.months), e.years = _n(e.years), this }, In.add = function (e, t) { return yn(this, e, t, 1) }, In.subtract = function (e, t) { return yn(this, e, t, -1) }, In.as = function (e) { if (!this.isValid()) return NaN; var t, n, s = this._milliseconds; if ("month" === (e = R(e)) || "year" === e) return t = this._days + s / 864e5, n = this._months + pn(t), "month" === e ? n : n / 12; switch (t = this._days + Math.round(vn(this._months)), e) { case "week": return t / 7 + s / 6048e5; case "day": return t + s / 864e5; case "hour": return 24 * t + s / 36e5; case "minute": return 1440 * t + s / 6e4; case "second": return 86400 * t + s / 1e3; case "millisecond": return Math.floor(864e5 * t) + s; default: throw new Error("Unknown unit " + e) } }, In.asMilliseconds = Mn, In.asSeconds = Sn, In.asMinutes = Dn, In.asHours = kn, In.asDays = Yn, In.asWeeks = On, In.asMonths = Tn, In.asYears = xn, In.valueOf = function () { return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * k(this._months / 12) : NaN }, In._bubble = function () { var e, t, n, s, i, r = this._milliseconds, a = this._days, o = this._months, u = this._data; return 0 <= r && 0 <= a && 0 <= o || r <= 0 && a <= 0 && o <= 0 || (r += 864e5 * gn(vn(o) + a), o = a = 0), u.milliseconds = r % 1e3, e = D(r / 1e3), u.seconds = e % 60, t = D(e / 60), u.minutes = t % 60, n = D(t / 60), u.hours = n % 24, o += i = D(pn(a += D(n / 24))), a -= gn(vn(i)), s = D(o / 12), o %= 12, u.days = a, u.months = o, u.years = s, this }, In.clone = function () { return At(this) }, In.get = function (e) { return e = R(e), this.isValid() ? this[e + "s"]() : NaN }, In.milliseconds = Pn, In.seconds = Wn, In.minutes = Hn, In.hours = Rn, In.days = Cn, In.weeks = function () { return D(this.days() / 7) }, In.months = Fn, In.years = Ln, In.humanize = function (e) { if (!this.isValid()) return this.localeData().invalidDate(); var t, n, s, i, r, a, o, u, l, d, h, c = this.localeData(), f = (n = !e, s = c, i = At(t = this).abs(), r = Un(i.as("s")), a = Un(i.as("m")), o = Un(i.as("h")), u = Un(i.as("d")), l = Un(i.as("M")), d = Un(i.as("y")), (h = r <= Nn.ss && ["s", r] || r < Nn.s && ["ss", r] || a <= 1 && ["m"] || a < Nn.m && ["mm", a] || o <= 1 && ["h"] || o < Nn.h && ["hh", o] || u <= 1 && ["d"] || u < Nn.d && ["dd", u] || l <= 1 && ["M"] || l < Nn.M && ["MM", l] || d <= 1 && ["y"] || ["yy", d])[2] = n, h[3] = 0 < +t, h[4] = s, function (e, t, n, s, i) { return i.relativeTime(t || 1, !!n, e, s) }.apply(null, h)); return e && (f = c.pastFuture(+this, f)), c.postformat(f) }, In.toISOString = En, In.toString = En, In.toJSON = En, In.locale = Qt, In.localeData = Kt, In.toIsoString = n("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", En), In.lang = Xt, I("X", 0, 0, "unix"), I("x", 0, 0, "valueOf"), ue("x", se), ue("X", /[+-]?\d+(\.\d{1,3})?/), ce("X", function (e, t, n) { n._d = new Date(1e3 * parseFloat(e, 10)) }), ce("x", function (e, t, n) { n._d = new Date(k(e)) }), c.version = "2.22.2", e = Tt, c.fn = ln, c.min = function () { return Pt("isBefore", [].slice.call(arguments, 0)) }, c.max = function () { return Pt("isAfter", [].slice.call(arguments, 0)) }, c.now = function () { return Date.now ? Date.now() : +new Date }, c.utc = y, c.unix = function (e) { return Tt(1e3 * e) }, c.months = function (e, t) { return fn(e, t, "months") }, c.isDate = h, c.locale = ot, c.invalid = v, c.duration = At, c.isMoment = S, c.weekdays = function (e, t, n) { return mn(e, t, n, "weekdays") }, c.parseZone = function () { return Tt.apply(null, arguments).parseZone() }, c.localeData = lt, c.isDuration = Rt, c.monthsShort = function (e, t) { return fn(e, t, "monthsShort") }, c.weekdaysMin = function (e, t, n) { return mn(e, t, n, "weekdaysMin") }, c.defineLocale = ut, c.updateLocale = function (e, t) { if (null != t) { var n, s, i = nt; null != (s = at(e)) && (i = s._config), (n = new P(t = b(i, t))).parentLocale = st[e], st[e] = n, ot(e) } else null != st[e] && (null != st[e].parentLocale ? st[e] = st[e].parentLocale : null != st[e] && delete st[e]); return st[e] }, c.locales = function () { return s(st) }, c.weekdaysShort = function (e, t, n) { return mn(e, t, n, "weekdaysShort") }, c.normalizeUnits = R, c.relativeTimeRounding = function (e) { return void 0 === e ? Un : "function" == typeof e && (Un = e, !0) }, c.relativeTimeThreshold = function (e, t) { return void 0 !== Nn[e] && (void 0 === t ? Nn[e] : (Nn[e] = t, "s" === e && (Nn.ss = t - 1), !0)) }, c.calendarFormat = function (e, t) { var n = e.diff(t, "days", !0); return n < -6 ? "sameElse" : n < -1 ? "lastWeek" : n < 0 ? "lastDay" : n < 1 ? "sameDay" : n < 2 ? "nextDay" : n < 7 ? "nextWeek" : "sameElse" }, c.prototype = ln, c.HTML5_FMT = { DATETIME_LOCAL: "YYYY-MM-DDTHH:mm", DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss", DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS", DATE: "YYYY-MM-DD", TIME: "HH:mm", TIME_SECONDS: "HH:mm:ss", TIME_MS: "HH:mm:ss.SSS", WEEK: "YYYY-[W]WW", MONTH: "YYYY-MM" }, c });
angular.module('verklizan.umox.common.html5.vkz-utilities.dateConversion').filter('MStoJSDate',
    ['$filter', 'dateExtensionService', function ($filter, dateExtensionService) {
        'use strict';

        return function (inputDate, dateFormat, doNotConvertToLocal) {
            var newDate =
                doNotConvertToLocal === true ?
                dateExtensionService.convertMsToDate(inputDate) :
                dateExtensionService.convertMsToDateLocal(inputDate);

            return $filter('date')(newDate, dateFormat);
        };
    }]
);

angular.module('verklizan.umox.common.html5.vkz-utilities.dateConversion').filter('MStoJSDateTime',
    ['$filter', 'dateExtensionService', function ($filter, dateExtensionService) {
        'use strict';

        return function (inputDate, dateFormat, doNotConvertToLocal) {
            var newDate =
                doNotConvertToLocal === true ?
                dateExtensionService.convertMsToDate(inputDate) :
                dateExtensionService.convertMsToDateLocal(inputDate);

            if (!dateFormat) {
                dateFormat = 'medium';
            }

            return $filter('date')(newDate, dateFormat);
        };
    }]
);

/**
 * @ngdoc service
 * @name CordovaUTIL.binarySearchAndLookupService
 *
 * @description
 * The binarySearchAndLookupService contains tested binary search functions which can be used on array's.
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').service('binarySearchAndLookupService',
    ['objectFieldUtilityService', function (objectFieldUtilityService) {
        'use strict';

        var getComparator = function (value, comparator, fieldName) {

            var defaultComparator = function (a, b) {
                return a < b;
            }

            var stringComparator = function (a, b) {
                var compareNumber = a.localeCompare(b);
                if (compareNumber < 0) { return true; }
                return false;

            }

            var objectComparator = function (comparator, fieldName) {
                var comparator = comparator;
                var fieldName = fieldName;
                return function (a, b) {
                    return comparator(objectFieldUtilityService.getFieldValue(a, fieldName), objectFieldUtilityService.getFieldValue(b, fieldName));
                }
            }

            if (typeof comparator === 'undefined' && typeof fieldName === 'undefined') {
                if (typeof value === 'number') {
                    return defaultComparator;
                }
                if (Object.prototype.toString.call(value) == '[object String]') { //_underscore implementation of _.isString
                    return stringComparator
                }
                return defaultComparator;
            }

            return objectComparator(comparator, fieldName);
        }


        var objectEqualiser = function (fieldName) {
            var fieldName = fieldName;
            return function (a, b) {
                var fieldA = objectFieldUtilityService.getFieldValue(a, fieldName);
                var fieldB = objectFieldUtilityService.getFieldValue(b, fieldName);
                return fieldA === fieldB;
            }
        }

        var defaultEqualizer = function (a, b) {
            return a === b;
        }

        /**
         * @ngdoc method
         * @name binarySearch
         * @methodOf CordovaUTIL.binarySearchAndLookupService
         * @param {Array} list The array of items which can be objects, strings or numbers.
         * @param {*} item The item to search for.
         * @param {string} [fieldName] Only when searching object property's. This will be the fieldname e.g. Identity.Name
         * @returns {Integer} The index of the item, -1 if not present.
         * @description
         * Performs a binary search on the array and returning the position of the item.
        */
        this.binarySearch = function (list, item, fieldName) {

            var comparator = getComparator(item);
            var equalizer = defaultEqualizer;

            //Check if searchByField is defined. If yes we are going to look in objects for comparing and equalizing.
            if (typeof fieldName !== 'undefined') {
                comparator = getComparator(objectFieldUtilityService.getFieldValue(item, fieldName));
                comparator = getComparator(null, comparator, fieldName);
                equalizer = objectEqualiser(fieldName);
            }



            var min = 0;
            var max = list.length - 1;
            var guess;

            while (min <= max) {
                guess = Math.floor((min + max) / 2);
                if (equalizer(list[guess], item)) {
                    return guess;
                }
                else {
                    if (comparator(list[guess], item)) {
                        min = guess + 1;
                    }
                    else {
                        max = guess - 1;
                    }
                }
            }

            return -1;

        }


        /**
         * @ngdoc method
         * @name findInsertIndexBinary
         * @methodOf CordovaUTIL.binarySearchAndLookupService
         * @param {Array} list The array of items which can be objects, strings or numbers.
         * @param {*} item The item to get index for.
         * @param {string} [fieldName] Only when searching object property's. This will be the fieldname e.g. Identity.Name
         * @returns {Integer} The index of the new item.
         * @description
         * Performs a binary search on the array and returning the future position of the item.
        */
        this.findInsertIndexBinary = function (list, item, fieldName) {

            var comparator = getComparator(item);
            var equalizer = defaultEqualizer;

            //Check if fieldName is defined. If yes we are going to look in objects for comparing and equalizing.
            if (typeof fieldName !== 'undefined') {
                comparator = getComparator(objectFieldUtilityService.getFieldValue(item, fieldName));
                comparator = getComparator(null, comparator, fieldName);
                equalizer = objectEqualiser(fieldName);
            }

            if (list.length === 0) { return 0; } //Empty list, thus position = 0

            var min = 0;
            var max = list.length - 1;
            var guess;

            //Get position of an element that comes close or is the same as the one we send 
            while (min <= max) {
                guess = Math.floor((min + max) / 2);
                if (equalizer(list[guess], item)) { //element same so ours goes 1 higher
                    return guess + 1;
                }
                else {
                    if (comparator(list[guess], item)) {
                        min = guess + 1;
                    }
                    else {
                        max = guess - 1;
                    }
                }
            }
            //We have the item of the one that comes closest
            if (comparator(list[guess], item)) {
                return guess + 1;
            } else {
                return guess;
            }

        }
    }]
);

/**
 * @ngdoc factory
 * @name CordovaUTIL.clientSettings
 *
 * @description
 * The clientSettings returns generic information which is useful for logging purposes
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').factory('clientSettings',
    ['$window', function ($window) {
        'use strict';

        function getBrowserLanguage() {

            if (typeof $window.navigator.userLanguage == "string") {
                return ($window.navigator.userLanguage);
            } else if (typeof $window.navigator.language == "string") {
                return ($window.navigator.language);
            } else {
                return ("(Not supported)");
            }
        }


        //http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
        function get_browser() {
            var ua = $window.navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return { name: 'IE', version: (tem[1] || '') };
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/)
                if (tem != null) { return { name: 'Opera', version: tem[1] }; }
            }
            M = M[2] ? [M[1], M[2]] : [$window.navigator.appName, $window.navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
            return {
                name: M[0],
                version: M[1]
            };
        }

        function calculateScreenDimensions() {
            return $window.isNullOrUndefined($window.screen) === false ? $window.screen.width + "x" + $window.screen.height : "Invalid";
        }

        var clientSettings = {};

        var browser = get_browser();

        clientSettings.browserEngine = $window.navigator.product;
        clientSettings.browserVersion = browser.version;
        clientSettings.browser = $window.navigator.userAgent;
        clientSettings.browserName = browser.name;
        clientSettings.language = getBrowserLanguage();
        clientSettings.systemInfo = $window.navigator.platform;
        clientSettings.device = {};

        if ($window.isNullOrUndefined($window.device) === false) {
            clientSettings.device.platform = $window.device.platform;
            clientSettings.device.model = $window.device.model;
            clientSettings.device.version = $window.device.version;
            clientSettings.device.cordovaVersion = $window.device.cordova;
            clientSettings.device.deviceUUID = $window.device.uuid;
            clientSettings.device.screenDimensions = calculateScreenDimensions();
        }
        

        return clientSettings;
    }]
);

/**
 * @ngdoc service
 * @name CordovaUTIL.BidirectionalPagingComponent
 * @requires CordovaUTIL.pageSize
 *
 * @description
 * Holds the page count and current page count for lists.
 *
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').factory('BidirectionalPagingComponent',
    ['pageSize', function (pageSize) {
        'use strict';

        // ============================
        // Constructor
        // ============================

        function BidirectionalPagingComponent(_pageSize) {
            this.pageSize = _pageSize;

            this.clear();
        }

        // ============================
        // Public fields
        // ============================
        /**
         * @ngdoc property
         * @name pageSizes
         * @propertyOf CordovaUTIL.BidirectionalPagingComponent
         *
         * @description
         * Returns the different pageSizes.
        */
        BidirectionalPagingComponent.pageSizes = pageSize;

        Object.defineProperties(BidirectionalPagingComponent.prototype, {
            /**
             * @ngdoc property
             * @name nextPageNumber
             * @methodOf CordovaUTIL.BidirectionalPagingComponent
             * @returns {int} Returns the next page number
             *
             * @description
             * Returns the nextPageNumber
            */
            nextPageNumber: {
                get: function () { return this.currentPageNumber + 1; }
            },

            /**
             * @ngdoc property
             * @name hasNextPage
             * @methodOf CordovaUTIL.BidirectionalPagingComponent
             * @returns {boolean} Returns if there is a next page.
             *
             * @description
             * Returns if the BidirectionalPagingComponent has a next page.
            */
            hasNextPage: {
                get: function () {
                    return this.nextPageNumber < this.pageCount;
                }
            },

            /**
             * @ngdoc property
             * @name hasPreviousPage
             * @methodOf CordovaUTIL.BidirectionalPagingComponent
             * @returns {boolean} Returns if there is a previous page.
             *
             * @description
             * Returns if the BidirectionalPagingComponent has a previous page.
            */
            hasPreviousPage : {
                get: function() {
                    return this.currentPageNumber > 0;
                }
            },

            /**
             * @ngdoc property
             * @name hasNoResults
             * @methodOf CordovaUTIL.BidirectionalPagingComponent
             * @returns {boolean} Returns true if there are no results otherwise false.
             *
             * @description
             * Returns if the BidirectionalPagingComponent has no results.
            */
            hasResults: {
                get: function () {
                    if (angular.isUndefined(this.data) || this.data === null) {
                        return false;
                    }
                    return this.data.length > 0 || this.totalCount > 0;
                }
            }
        });

        // ============================
        // Public methods
        // ============================


        /**
         * @ngdoc method
         * @name addData
         * @methodOf CordovaUTIL.BidirectionalPagingComponent
         * @param {object} data Object which should contain the data (in an array) and the TotalCount of the data. Should look something like { Rows : ['array'], TotalCount: 1 }.
         *
         * @description
         * Sets the data for the BidirectionalPagingComponent.
        */
        BidirectionalPagingComponent.prototype.addData = function (data, pageIndex) {
            if (typeof this.data === "undefined" || this.data === null) {
                this.data = [];
            }

            if (data.Rows.length > this.pageSize) {
                throw new Error("Returned data row lenght cannot be higher than pageSize.");
            }

            this.data = data.Rows;
            this.totalCount = data.TotalCount;

            var pageCountDouble = data.TotalCount / this.pageSize;
            this.pageCount = Math.ceil(pageCountDouble);

            this.currentPageNumber = pageIndex;
        };

        /**
         * @ngdoc method
         * @name method
         * @methodOf CordovaUTIL.BidirectionalPagingComponent
         *
         * @description
         * Clears the data of the BidirectionalPagingComponent.
        */
        BidirectionalPagingComponent.prototype.clear = function () {
            this.totalCount = 0;
            this.pageCount = 0;
            this.currentPageNumber = -1;
            this.data = null;
        };



        return (BidirectionalPagingComponent);
    }]);

angular.module('verklizan.umox.common.html5.vkz-utilities.general').factory('Dictionary',
    function () {
        'use strict';


        /**
         * @ngdoc service
         * @name CordovaUTIL.Dictionary
         *
         * @description
         * The Dictionary adds functionalities to an associativeArray having a similar usage like the c# variant.
        */
        function Dictionary() {

            //The object containing our data. Do not use an array cause we will be implementing our own push/sort/etc.
            var associativeArray = new Object();

            //#region private functions

            var addDictionaryItem = function (key, value) {
                associativeArray[key] = value;
            }

            var removeDictionaryItem = function (key) {
                delete associativeArray[key];
            }

            //#endregion

            //#region public functions
            /**
             * @ngdoc method
             * @name containsKey
             * @methodOf CordovaUTIL.Dictionary
             * @param {identifier} key an identifier
             * @returns {boolean} true or false depending if the key is present in the Dictionary
             *
             * @description
             * Returns a true if the key is present in the Dictionary. Returns a false if not.
            */
            this.containsKey = function (key) {
                if (associativeArray.hasOwnProperty(key)) { return true; }
                return false;
            }

            /**
             * @ngdoc method
             * @name containsValue
             * @methodOf CordovaUTIL.Dictionary
             * @param {value} value an object, string or integer.
             * @returns {boolean} true or false depending if the value is present in the Dictionary
             *
             * @description
             * Returns true or false based on if the value is found
            */
            this.containsValue = function (value) {
                var keys = Object.keys(associativeArray);
                for (var i = 0; i < keys.length; i++) {
                    if (associativeArray[keys[i]] === value) { return true; }
                }
                return false;
                /* Future solution ECMA 6+ (doesn't work as of 28-7 2015 in most browsers by default.
                    for (let key of Object.keys(associativeArray)) {
                        if(associativeArray[key] === value) { return true; }
                    }
                */
            }

            /**
             * @ngdoc method
             * @name add
             * @methodOf CordovaUTIL.Dictionary
             * @param {identifier} key an identifier for the value
             * @param {value} value an object, string or integer.
             * @returns {boolean} true or false depending if key/value combination has been added to the dictionary
             *
             * @description
             * Add item to dictionary. Validates on key if exist or not. Returns true on success. false on failure.
            */
            this.add = function (key, value) {
                if (this.containsKey(key)) { return false; }
                addDictionaryItem(key,value);
                return true;
            }

            /**
             * @ngdoc method
             * @name remove
             * @methodOf CordovaUTIL.Dictionary
             * @param {key} key an identifier.
             *
             * @description
             * Removes a dictionary item on key.
            */
            this.remove = function (key) {
                removeDictionaryItem(key);
            }

            /**
             * @ngdoc method
             * @name size
             * @methodOf CordovaUTIL.Dictionary
             * @returns {integer} integer the size of the dictionary

             * @description
             * Returns size of the dictionary.
            */
            this.size = function () {
                return Object.keys(associativeArray).length;
            }

            /**
             * @ngdoc method
             * @name clear
             * @methodOf CordovaUTIL.Dictionary

             * @description
             * Clears the dictionary.
            */
            this.clear = function () {
                associativeArray = new Object();
            };

            /**
             * @ngdoc method
             * @name fill
             * @methodOf CordovaUTIL.Dictionary
             * @param {array} array Array with objects having a key/value property.

             * @description
             * Adds a list of objects with key/value properties into the dictionary.
             * Slow, because checks have to be done on validation key. 
             * true on success, false on failure.
            */
            this.fill = function (_data) {
                for (var i = 0; i < _data.length; i++) {
                    var success = this.add(_data[i].key, _data[i].value);
                    if (success === false) {
                        this.clear();
                        return false;
                    }
                }
                return true;
            }

            /**
             * @ngdoc method
             * @name tryGetValue
             * @methodOf CordovaUTIL.Dictionary
             * @returns {value} the value of the key
             * @description
             * Returns value for key or null when not found.
            */
            this.tryGetValue = function (key) {
                if (this.containsKey(key)) {
                    return associativeArray[key];
                }
                return null;
            }

            /**
             * @ngdoc method
             * @name getValues
             * @methodOf CordovaUTIL.Dictionary
             * @returns {array} the values of the dictionary in an array
             * @description
             * Returns array of values that are present in the dictionary
            */
            this.getValues = function () {
                var values = [];
                var keys = Object.keys(associativeArray);
                for (var i = 0; i < keys.length; i++) {
                    values.push(associativeArray[keys[i]]);
                }
                return values;
            }

            /**
              * @ngdoc method
              * @name getKeys
              * @methodOf CordovaUTIL.Dictionary
              * @returns {array} the keys of the dictionary in an array
              * @description
              * Returns array of keys that are present in the dictionary
             */
            this.getKeys = function () {
                return Object.keys(associativeArray);
            }

            //#endregion
        }

        return Dictionary;

    }
);
/**
 * @ngdoc service
 * @name CordovaUTIL.EndlessScrollPagingComponent
 * @requires CordovaUTIL.pageSize
 *
 * @description
 * Holds the page count and current page count for lists.
 *
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').factory('EndlessScrollPagingComponent',
    ['pageSize', function (pageSize) {
        'use strict';

        // ============================
        // Constructor
        // ============================

        function EndlessScrollPagingComponent(_pageSize) {
            this.pageSize = _pageSize;

            this.clear();
        }

        // ============================
        // Public fields
        // ============================
        /**
         * @ngdoc property
         * @name pageSizes
         * @propertyOf CordovaUTIL.EndlessScrollPagingComponent
         *
         * @description
         * Returns the different pageSizes.
        */
        EndlessScrollPagingComponent.pageSizes = pageSize;

        Object.defineProperties(EndlessScrollPagingComponent.prototype, {
            /**
             * @ngdoc property
             * @name nextPageNumber
             * @methodOf CordovaUTIL.EndlessScrollPagingComponent
             * @returns {int} Returns the next page number
             *
             * @description
             * Returns the nextPageNumber
            */
            nextPageNumber: {
                get: function () { return this.currentPageNumber + 1; }
            },
            /**
             * @ngdoc property
             * @name hasNextPage
             * @methodOf CordovaUTIL.EndlessScrollPagingComponent
             * @returns {boolean} Returns if there is a next page.
             *
             * @description
             * Returns if the EndlessScrollPagingComponent has a next page.
            */
            hasNextPage: {
                get: function () {
                    return this.nextPageNumber < this.pageCount;
                }
            },
            /**
             * @ngdoc property
             * @name hasNoResults
             * @methodOf CordovaUTIL.EndlessScrollPagingComponent
             * @returns {boolean} Returns true if there are no results otherwise false.
             *
             * @description
             * Returns if the EndlessScrollPagingComponent has no results.
            */
            hasNoResults: {
                get: function () {
                    if (angular.isUndefined(this.data) || this.data === null) {
                        return false;
                    }
                    return this.data.length === 0 && this.totalCount === 0;
                }
            }
        });

        // ============================
        // Public methods
        // ============================


        /**
         * @ngdoc method
         * @name addData
         * @methodOf CordovaUTIL.EndlessScrollPagingComponent
         * @param {object} data Object which should contain the data (in an array) and the TotalCount of the data. Should look something like { Rows : ['array'], TotalCount: 1 }.
         *
         * @description
         * Sets the data for the EndlessScrollPagingComponent.
        */
        EndlessScrollPagingComponent.prototype.addData = function (data) {
            if (typeof this.data === "undefined" || this.data === null) {
                this.data = [];
            }
            Array.prototype.push.apply(this.data, data.Rows);

            this.totalCount = data.TotalCount;

            var pageCountDouble = data.TotalCount / this.pageSize;
            this.pageCount = Math.ceil(pageCountDouble);

            this.currentPageNumber += 1;
        }

        /**
         * @ngdoc method
         * @name method
         * @methodOf CordovaUTIL.EndlessScrollPagingComponent
         *
         * @description
         * Clears the data of the EndlessScrollPagingComponent.
        */
        EndlessScrollPagingComponent.prototype.clear = function () {
            this.totalCount = 0;
            this.pageCount = 0;
            this.currentPageNumber = -1;
            this.data = null;
        }



        return (EndlessScrollPagingComponent);
    }]);

/**
 * @ngdoc object
 * @name CordovaUTIL.pageSize
 *
 * @description
 * Holds differnet value's for different types of pageSizes.
 *
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').constant('pageSize', {
    /**
     * @ngdoc property
     * @name Small
     * @propertyOf CordovaUTIL.pageSize
     *
     * @description
     * value for small pagesize.
     * **Notice!** This is a constant.
    */
    Small: 10,
    /**
     * @ngdoc property
     * @name Normal
     * @propertyOf CordovaUTIL.pageSize
     *
     * @description
     * value for normal pagesize.
     * **Notice!** This is a constant.
    */
    Normal: 20,
    /**
     * @ngdoc property
     * @name Large
     * @propertyOf CordovaUTIL.pageSize
     *
     * @description
     * value for large pagesize.
     * **Notice!** This is a constant.
    */
    Large: 100,
    /**
     * @ngdoc property
     * @name XXLarge
     * @propertyOf CordovaUTIL.pageSize
     *
     * @description
     * value for extra large pagesize.
     * **Notice!** This is a constant.
    */
    XXLarge: 1500
});
/**
 * @ngdoc directive
 * @name CordovaUTIL.directives.diEquals
 *
 * @description
 * This directive checks if for example two input fields have the same value. Usable for use cases like resetting password.
 * http://stackoverflow.com/a/18014975/1070037
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').directive('diEquals', function () {
    'use strict';

    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        scope: {
            diEquals : '='
        },
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) {
                return;// do nothing if no ng-model
            }

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function () {
                validate();
            });

            // observe the other value and re-validate on change
            scope.$watch(function () {
                return scope.diEquals;
            }, function () {
                validate();
            });

            var validate = function () {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = scope.diEquals;

                // set validity
                var isValid = val1 === val2;
                ngModel.$setValidity('equals', isValid);
            };
        }
    }
});

/**
 * @ngdoc service
 * @name CordovaUTIL.elfproefService
 *
 * @description
 * The elfproefService contains methods to validate bsn and bank account numbers against the "elfproef" and "variant elfproef" rules.
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').service('elfproefService',
    ['objectFieldUtilityService', function (objectFieldUtilityService) {
        'use strict';

        function calculateElfProef(totalNumber, character, index, reverse, isBSN) {
            var multiplyWith;
            if (reverse) {
                multiplyWith = index;
            } else if (index === 8 && isBSN) {
                multiplyWith = -1;
            } else {
                multiplyWith = 10 - (index + 1);
            }
            console.log("multiply " + character + " with " + multiplyWith + " reverse is " + reverse + " for index " + index);

            return totalNumber + (character * multiplyWith);
        }

        /**
         * @ngdoc method
         * @name elfproef
         * @methodOf CordovaUTIL.elfproefService
         * @param {String or Integer} a value to test against the elfproef
         * @returns {Bool} returns if it matches the elfproof
         * @description
         * Performs a weighted multiplication on the value and returns whether the value matches the elfproef.
        */
        this.elfproef = function (value) {

            var stringifiedElfproofValue;

            if (typeof value === 'string') {
                stringifiedElfproofValue = value;
            } else {
                return false;
            }

            if (stringifiedElfproofValue.length < 9 || stringifiedElfproofValue.length > 11) {
                return false;
            }

            var reverse = false;
            var totalNumber = 0;
            for (var i = 0; i < stringifiedElfproofValue.length; i++) {
                var character = parseInt(stringifiedElfproofValue.charAt(i));
                if (isNaN(character)) {
                    return false;
                }

                if (i === 0 && character === 0) { reverse = true; console.log("reverse"); continue; }
                totalNumber = calculateElfProef(totalNumber, character, i, reverse, false);
            }
            console.log(totalNumber);
            var resultHigherThan0 = (totalNumber / 11) !== 0;
            return resultHigherThan0 && (totalNumber % 11) === 0;
        }


        /**
         * @ngdoc method
         * @name bsnElfProef
         * @methodOf CordovaUTIL.elfproefService
         * @param {String or Integer} a value to test against the bsn elfproef
         * @returns {Bool} returns if it matches the bsn elfproof
         * @description
         * Performs a weighted multiplication on the value and returns whether the value matches the bsn elfproef.
        */
        this.bsnElfProef = function (value) {

            var stringifiedElfproofValue;

            if (typeof value === 'string') {
                stringifiedElfproofValue = value;
            } else {
                return false;
            }

            if (stringifiedElfproofValue.length !== 9) {
                return false;
            }

            var totalNumber = 0;
            for (var i = 0; i < stringifiedElfproofValue.length; i++) {
                var character = parseInt(stringifiedElfproofValue.charAt(i));
                if (isNaN(character)) {
                    return false;
                }
                totalNumber = calculateElfProef(totalNumber, character, i, false, true);
            }
            console.log(totalNumber);
            var resultHigherThan0 = (totalNumber / 11) !== 0;
            return resultHigherThan0 && (totalNumber % 11) === 0;
        }

    }]
);

//This are global functinos for often used checks.

function isNullOrUndefined(value) {
	return value === null || typeof value === 'undefined';
}

function isEmptyOrNullString(value) {
	return value === null || (typeof value === 'string' && value.trim() === '');
}

function isNullOrUndefinedOrEmpty(value) {
    return value === null || (typeof value === 'string' && value.trim() === '') || typeof value === 'undefined';
}

function isGuid(stringToTest) {
    if (stringToTest[0] === "{") {
        stringToTest = stringToTest.substring(1, stringToTest.length - 1);
    }
    var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
    return regexGuid.test(stringToTest);
}
/**
 * @ngdoc service
 * @name CordovaUTIL.hierarchyService
 * @requires CordovaUTIL.Dictionary
 *
 * @description
 * The hierarchyService is responsible for making a hierarchy from a flat list.
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').service('hierarchyService',
    ['Dictionary', 'binarySearchAndLookupService', function (Dictionary, binarySearchAndLookupService) {

        var dictionary = new Dictionary();

        'use strict';

        function Node(_value) {
            this.children = []; //Node objects who are my children
            this.parent = null; //Node object who my parent is
            this.value = _value; //Node object who I am
        }

        /**
         * @ngdoc method
         * @name buildHierarchy
         * @methodOf CordovaUTIL.hierarchyService
         * @returns {array} an array of the uber Node
         * @description
         * Returns array of values the uber Node. Which contains a tree (which have potential children who have children and other children, etc)
        */
        this.buildHierarchy = function (itemArray, sortByField) {

            //We are going to use the dictionaryService for a int(Id), object(Node) dict.
            var lookup = new Dictionary();
            var topNode;

            //Fill our lookUp array
            for (var i = 0; i < itemArray.length; i++) {
                lookup.add(itemArray[i].Id, new Node(itemArray[i]));
            }

            //Complete our Node lookup list by filling in more information.
            var values = lookup.getValues();
            for (var i = 0; i < values.length; i++) {
                var _parent = lookup.tryGetValue(values[i].value.ParentId);
                //We have to find if there is a value in our lookup dictionary.
                if (_parent !== null) {
                    values[i].parent = _parent;

                    var fieldName = 'value.' + sortByField; //Has to search inside a Node for the object. The object is under the property 'value'.

                    var position = binarySearchAndLookupService.findInsertIndexBinary(_parent.children, values[i], fieldName);

                    //push op index
                    _parent.children.splice(position, 0, values[i]);
                } else {
                    topNode = values[i];
                }
            }

            return topNode;
        }
    }]
);

// These functions have been copied from https://developer.mozilla.org

Number.isFinite = Number.isFinite || IEisFinite;

function IEisFinite (value) {
    return typeof value === "number" && isFinite(value);
};
/**
 * @ngdoc service
 * @name CordovaUTIL.objectFieldUtilityService
 *
 * @description
 * The objectFieldUtilityService contains methods for looking up property's and setting these in objects.
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').service('objectFieldUtilityService',
    function () {
        'use strict';

        /**
         * @ngdoc method
         * @name getFieldValue
         * @methodOf CordovaUTIL.objectFieldUtilityService
         * @param {object} obj The object where to search the property for.
         * @param {string} fieldName The fieldname to locate.
         * @returns {*} The value of the property.
         * @description
         * Search for property in an object (potentially multiple layers deep through the dot syntax e.g. Identity.Name) and returns its value.
         * Returns an undefined if no value is found with this property
        */
        this.getFieldValue = function (obj, fieldName) {
            var fieldsArr = fieldName.split('.');
            for (var i = 0; i < fieldsArr.length; i++) {
                if(obj == null) { return undefined; }
                obj = obj[fieldsArr[i]];
            }
            return obj;
        }

        /**
         * @ngdoc method
         * @name setFieldValue
         * @methodOf CordovaUTIL.objectFieldUtilityService
         * @param {object} obj The object to set the value in
         * @param {string} fieldName The fieldname to locate and set the value in
         * @param {*} newValue The value which will be set.
         * @returns {boolean} true on success false on failure.
         * @description
         * Sets the value on the specified fieldName even hwen multiple layers deep (e.g. Identity.Name).
         * This function will create empty objects when property's are not defined (e.g. Identity hasn't been defined or is null will become an empty object).
         * This function can not be used to set the value to an empty object.
         * Returns true on success or false on failure.
        */
        this.setFieldValue = function (object, fieldName, newValue) {
            var propertyTree = fieldName.split('.');
            if (object == null) { return false; }
            for (var i = 0; i < propertyTree.length - 1; i++) {
                if (object[propertyTree[i]] == null) { //check on null and undefined. A value is allowed to be false
                    object[propertyTree[i]] = {};
                } //Protection against setting a field of an undefined (which would throw an error)
                object = object[propertyTree[i]];
            }
            var propertyName = propertyTree[propertyTree.length - 1];

            if (typeof newValue === 'object' && newValue !== null && Object.keys(newValue).length === 0 && !isValidDate(newValue)) { //check on empty object then set null.
                newValue = null;
            }
            object[propertyName] = newValue;
            return true;
        }

        function isValidDate(date) {
            return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
          }
    }
);

/**
* @ngdoc service
* @name CordovaUTIL.promiseLoadingSpinnerService
* @requires CordovaUTIL.Dictionary
*
* @description
* promiseLoading spinner is to make a central promise manager, which can tell if there are still promises to be resolved
* on a certain page. It will reset on page navigation. This service can be used by a spinner directive to determine if it should be visible or not.
* To work correctly, you will need to send every promise created in the controller or service to this service, so it can communicate its information with the linked directive.
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').factory('promiseLoadingSpinnerService',
['$q', '$rootScope', function ($q, $rootScope) {
    'use strict';

    // ============================
    // Private Fields
    // ============================
    var promiseLoadingSpinnerService = {};
    var callbackMethods = [];
    var loadingPromise = $q.resolve();
    var loadingObject = {
        isLoading: false
    };
    var objectQueue = {};
    var totalIndexPromise = 0;

    // ============================
    // Events
    // ============================
    $rootScope.$on("$locationChangeSuccess", function () {
        clearLoadingData();
    });

    $rootScope.$on("$stateChangeSuccess", function () {
        clearLoadingData();
    });

    // ============================
    // Public Methods
    // ============================
    /**
    * @ngdoc method
    * @name registerForLoadingUpdate
    * @methodOf CordovaUTIL.promiseLoadingSpinnerService
    * @param {function} callbackFunction This function will be called when the state of this service changes or the isLoading boolean changes.
    * @description
    * Subscribes a certain method for callbacks if the state of this service changes or the isLoading boolean changes value. The callback consists of 1 parameters, which indicates
    * if the service is still loading.
    */
    promiseLoadingSpinnerService.registerForLoadingUpdate = function (callbackFunction) {
        if (typeof callbackFunction !== "function") {
            throw new Error("callback method is not a function");
        }

        callbackMethods.push(callbackFunction);
        sendCallbackOfIsLoading();
    };

    /**
    * @ngdoc method
    * @name unregisterForLoadingUpdate
    * @methodOf CordovaUTIL.promiseLoadingSpinnerService
    * @param {function} callbackFunction This function will be removed to be called when isLoading changes
    * @description
    * Unsubscribes a certain method for callbacks if the state of this service changes or the isLoading boolean changes value
    */
    promiseLoadingSpinnerService.unregisterForLoadingUpdate = function (callbackFunction) {
        if (typeof callbackFunction !== "function") {
            throw new Error("callback method is not a function");
        }

        for (var i = 0; i < callbackMethods.length; i++) {
            var callbackMethod = callbackMethods[i];
            if(callbackMethod === callbackFunction) {
                callbackMethods.splice(i, 1);
                return;
            }
        }
    };

    /**
    * @ngdoc method
    * @name registerForLoadingUpdate
    * @methodOf CordovaUTIL.promiseLoadingSpinnerService
    * @param {function} promise New promise to add to the loading stack
    * @description
    * Adds a new loading spinner to list of promise to wait to be done loading. It will automatically notify all registered functions about the new loading promise.
    */
    promiseLoadingSpinnerService.addLoadingPromise = function (promise) {
        updateLoadingPromise($q.when(promise));
    };

    /**
    * @ngdoc method
    * @name registerForLoadingUpdate
    * @methodOf CordovaUTIL.promiseLoadingSpinnerService
    * @return {boolean} If the service is loading at the moment.
    * @description
    * Can be used to retrieve the current state of the loading service. To be notified about changes in this object is can be set on the scope, or you can register for
    * callbacks.
    */
    promiseLoadingSpinnerService.getIsLoading = function () {
        return loadingObject.isLoading;
    };

    promiseLoadingSpinnerService.getIsLoadingObject = function () {
        return loadingObject;
    };


    /**
    * @ngdoc method
    * @name registerTimeoutPromise
    * @methodOf CordovaUTIL.promiseLoadingSpinnerService
    * @description
    * Can be used to add a spinner promise for xx milliseconds (or the next time the browser queue gets pushed to the stack).
    * In practise it can be used for example when changing state.
    */
    promiseLoadingSpinnerService.registerTimeoutPromise = function (optionalInt) {
        var timeoutTime = isFinite(optionalInt) ? optionalInt : 0;
        var deferred = $q.defer();
        setTimeout(function () {
            deferred.resolve();
        }, timeoutTime);
        promiseLoadingSpinnerService.addLoadingPromise(deferred.promise);
    };

    // ============================
    // Private Methods
    // ============================

    var sendCallbackOfIsLoading = function () {
        for (var index in callbackMethods) {
            callbackMethods[index](promiseLoadingSpinnerService.getIsLoading());
        }
    };

    var clearLoadingData = function () {
        loadingPromise = $q.when();
        totalIndexPromise = 0;
        objectQueue = {};
        promiseLoadingSpinnerService.addLoadingPromise(loadingPromise);
    };

    var updateLoadingPromise = function (promise) {
        totalIndexPromise++;
        loadingObject.isLoading = true;
        objectQueue[totalIndexPromise] = totalIndexPromise;
        loadingPromise = $q.allSettled([promise, loadingPromise]);
        loadingPromise.finally(getLoadingFinishedMethod());
        sendCallbackOfIsLoading();
    };

    var getLoadingFinishedMethod = function () {
        var indexOfPromise = totalIndexPromise;

        return function () {
            delete objectQueue[indexOfPromise];
            if (Object.keys(objectQueue).length === 0) {
                loadingDone();
            }
        };
    };

    var loadingDone = function () {
        loadingObject.isLoading = false;
        sendCallbackOfIsLoading();
    }

    return promiseLoadingSpinnerService;
}]);

/**
 * @ngdoc factory
 * @name CordovaUTIL.shortMemoryDataManager
 *
 * @description
 * Allows holding data in memory. Can be used for different functions like list-detail views.
 * Especially usefull for cross controller lists like edit pages.
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').factory('shortMemoryDataManager',
    function () {
        'use strict';

        //Contains strings which corresponds to a dynamic added array
        var listInMem = [];

        //Here is some magic going which I'll explain. Javascript is pass by value AND pass by reference.
        //How can it be both? Well primitives are passed by value and objects are passed by references.
        //This means we want to create a dynamic object, containing the array. Which has methods to edit the underlying array.
        //Thus when this service is called and there is a request for this object a reference will be send of this object. 
        //Allowing easy sharing of this array and easy array binding for cross state views.
        function MemoryObject() {

            //the array containing the items in our list.
            //This is not to be except for binding
            this.itemArray = [];

            //Now we give our own methods to make it act more like an array (which we want)
            this.push = function (item) {
                this.itemArray.push(item);
            }
            this.unshift = function (item) {
                this.itemArray.unshift(item);
            }
            this.concat = function (array) {
                //Because of references we can't add it using the concat functino as this will create a new array and we need the references on the array to work as well.
                //No need to optimize as this is a shortMemoryDataManager and shouldn't be used with large arrays (50+)
                for (var i = 0; i < array.length; i++) {
                    this.itemArray.push(array[i]);
                }
            }
            this.pop = function () {
                return this.itemArray.pop();
            }
            this.shift = function () {
                return this.itemArray.shift();
            }
            this.indexOf = function (item) {
                return this.itemArray.indexOf(item);
            }

            //Here are some functions which are always helpful
            //Replaces item to on index
            this.replace = function (item, index) {
                this.itemArray[index] = item;
            }

            //returns the array
            this.getList = function () {
                return this.itemArray;
            }

            //returns an item on index
            this.getItemByIndex = function (index) {
                return this.itemArray[index];
            }

            //returns a copy of an item of the index. returns null if not a valid index or when item does not exist.
            this.getCopyItemByIndex = function (index) {
                if (index < 0) { return null; }
                var copy = {};

                function isEmpty(obj) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            return false;
                        }
                    }

                    return true;
                }

                angular.copy(this.itemArray[index], copy);
                if (isEmpty(copy)) {
                    return null;
                }

                return copy;
            }

            //Check if item exists returns bool
            this.contains = function (item) {
                return this.itemArray.indexOf(item) > -1;
            }

            //Set list
            this.setList = function (list) {
                this.itemArray = list;
                return this.itemArray;
            }

            this.removeByIndex = function (index) {
                this.itemArray.splice(index, 1);
            }

            this.splice = function (i1, i2) {
                this.itemArray.splice(i1, i2);
            }

            this.removeByItem = function (item) {
                this.itemArray.splice(this.itemArray.indexOf(item), 1);
            }

        }



        //Creates a dynamic array for listName which is a string
        //Only creates the new array if not already exist
        this.createOrFindDynamicMemByName = function (listName) {
            if (listInMem.indexOf(listName) === -1) {
                this[listName] = new MemoryObject();
                listInMem.push(listName);
            }
            return this[listName];
        }

        //Removes a memory object
        this.removeList = function (listName) {
            listInMem.splice(listInMem.indexOf(listName), 1);
            this[listName] = undefined; //released reference for garbage cleaning
        }

        //Removes all memory objects for garbage collection
        this.cleanAll = function () {
            var i = 0, arrLength = listInMem.length;
            for (; i < arrLength; i++) {
                this[listInMem[i]] = undefined;
            }
            listInMem = [];
        }

        //Returns a true if the list exists, false if it does not.
        this.hasList = function (listName) {
            return listInMem.indexOf(listName) !== -1;
        }

        return this;
    });
// These functions have been copied from https://developer.mozilla.org

if (!String.prototype.endsWith) {
    String.prototype.endsWith = IEendsWith;
}

function IEendsWith(searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
}

angular.module('verklizan.umox.common.html5.vkz-utilities.general').config(['$provide', function ($provide) {

    $provide.decorator('$q', ['$delegate', function ($delegate) {
        var $q = $delegate

        var mapValues = function (obj, callback) {
            if (angular.isArray(obj))
                return obj.map(callback)

            var ret = {}
            Object.keys(obj).forEach(function (key, val) {
                ret[key] = callback(obj[key], key)
            })
            return ret
        }

        $q.allSettled = function (promises) {

            return $q.all(mapValues(promises, function (promiseOrValue) {
                if (!promiseOrValue.then)
                    return { state: 'fulfilled', value: promiseOrValue }

                return promiseOrValue.then(function (value) {
                    return { state: 'fulfilled', value: value }
                }, function (reason) {
                    return { state: 'rejected', reason: reason }
                })
            }))
        }

        return $q;
    }])
}])
/**
 * @ngdoc service
 * @name CordovaUTIL.utilities
 *
 * @description
 * creates an unique guid
 *
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.general').factory('utilities',
    function () {
        'use strict';

        return {
            //Creates a Guid
            createUniqueId: function () {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");
                return uuid;
            },
            stringFormat: function (format) {
                var args = Array.prototype.slice.call(arguments, 1);
                return format.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined' ? args[number] : match
                    ;
                });
            }
        };
    }
);

angular.module('verklizan.umox.common.html5.vkz-utilities.localisation').directive('i18n',
    ['$rootScope', 'localisationService', function ($rootScope, localisationService) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                localisationKey: "@i18n"
            },
            template: '{{localisedString}}',
            link: function (scope, element, attributes) {
                scope.localisedString = "";

                scope.$watch(function () { return scope.localisationKey; }, function (newValue, oldValue) {
                    if (newValue) {
                        getLocalizedString(newValue);
                    }
                });

                function getLocalizedString(localisationKey) {
                    localisationService.getLocalizedStringAsync(localisationKey).then(function (localisationValue) {
                        scope.localisedString = localisationValue;
                    });
                }
            }
        };

    }]);
angular.module('verklizan.umox.common.html5.vkz-utilities.localisation').directive('i18nPlaceholder',
    ['$rootScope', 'localisationService', function ($rootScope, localisationService) {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                scope.localisedString = "";

                scope.$watch(function () { return attributes.i18nPlaceholder; }, function (newValue, oldValue) {
                    if (newValue) {
                        getLocalizedString(newValue);
                    }
                }); 

                function getLocalizedString(localisationKey) {
                    localisationService.getLocalizedStringAsync(localisationKey).then(function (localisationValue) {
                        attributes.$set('placeholder', localisationValue);
                    });
                }
            }
        };

    }]);
angular.module('verklizan.umox.common.html5.vkz-utilities.localisation').service('localisationHelper',
    function () {
        'use strict';

        this.loadLocaleFiles = function (language) {
            loadMobiscrollLocaleFile(language);
        };

        function loadMobiscrollLocaleFile(language) {
            if (typeof $.mobiscroll === "undefined") {
                return;
            }

            $.mobiscroll.setDefaults({
                lang: language
            });
        }
    }
);

angular.module('verklizan.umox.common.html5.vkz-utilities.localisation').provider('localisationService',
    function () {
        'use strict';

        var resourceFileUrl = "../../shared/localisation/";
        var resourceFileNamePrefix = "resources-locale_";
        var defaultLanguage = "default";

        this.setResourceFilesUrl = function (_resourceFileUrl) {
            resourceFileUrl = _resourceFileUrl;
        }

        this.setResourceFileNamePrefix = function (_resourceFilePrefix) {
            resourceFileNamePrefix = _resourceFilePrefix;
        }

        this.setDefaultLanguage = function (_defaultLanguage) {
            defaultLanguage = _defaultLanguage;
        }

        this.$get = ['$q', '$window', '$http', 'languageSettingsService', 'localisationHelper', function ($q, $window, $http, languageSettingsService, localisationHelper) {

            // ============================
            // Private Fields
            // ============================
            var resourceFileExtension = ".json";
            var dictionaryCustomLanguage = {};
            var dictionaryDefaultLanguage = {};
            var loadLanguageDictionaryPromise;
            var httpGetConfig = {
                params: {
                    nocache: new Date().getTime()
                }
            }

            // ============================
            // Public methods
            // ============================
            var i18nService = {
                initNewLanguage: function () {
                    dictionaryCustomLanguage = {};
                    dictionaryDefaultLanguage = {};
                    initLocalizedResources();
                },                             

                getLocalizedStringAsync: function (stringsToTranslate, allowGracefullCatch) {
                    if (window.isNullOrUndefined(stringsToTranslate) && allowGracefullCatch !== true) {
                        throw new Error("Localisation key cannot be empty");
                    }

                    var defferedTranslation = $q.defer();

                    loadLanguageDictionaryPromise.finally(function () {
                        if (angular.isArray(stringsToTranslate)) {
                            var translatedStrings = [];
                            for (var i = 0; i < stringsToTranslate.length; i++) {
                                translatedStrings[i] = retrieveTranslationFromLoadedLanguageFiles(stringsToTranslate[i], defferedTranslation);
                            }
                            defferedTranslation.resolve(translatedStrings);
                        }
                        else {
                            defferedTranslation.resolve(retrieveTranslationFromLoadedLanguageFiles(stringsToTranslate, defferedTranslation));
                        }
                    });

                    if (allowGracefullCatch !== true) {
                        defferedTranslation.promise.catch(function (errorMessage) {
                            console.error(errorMessage);
                        });
                    }

                    return defferedTranslation.promise;
                }

            };

            // ============================
            // Private Methods
            // ============================
            function initLocalizedResources() {
                var selectedLanguage = languageSettingsService.getLanguage();
                if (!selectedLanguage) {
                    loadLanguageDictionaryPromise = loadDefaultLanguageFile();
                } else {
                    loadLanguageDictionaryPromise = loadCustomLanguageFile(selectedLanguage).finally(loadDefaultLanguageFile);
                }

                localisationHelper.loadLocaleFiles();
            };

            function retrieveTranslationFromLoadedLanguageFiles(stringToTranslate, promiseToRejectIfNecessary) {
                var selectedLanguageEntry = getDictionaryItem(dictionaryCustomLanguage, stringToTranslate);

                if (selectedLanguageEntry !== null) {
                    return selectedLanguageEntry;
                }
                else {
                    var defaultLanguageEntry = getDictionaryItem(dictionaryDefaultLanguage, stringToTranslate);

                    if (defaultLanguageEntry !== null) {
                        return defaultLanguageEntry;
                    }
                    else {
                        promiseToRejectIfNecessary.reject("Key not present in any localisation dictionary: " + stringToTranslate);
                    }
                }
            }

            function loadCustomLanguageFile(selectedLanguage) {
                var urlResourceFileCustomLanguage = resourceFileUrl + resourceFileNamePrefix + selectedLanguage + resourceFileExtension;

                return $http.get(urlResourceFileCustomLanguage, httpGetConfig).then(function (response) {
                    dictionaryCustomLanguage = response.data;
                });
            }

            function loadDefaultLanguageFile() {
                var urlResourceFileDefaultLanguage = resourceFileUrl + resourceFileNamePrefix + defaultLanguage + resourceFileExtension;

                return $http.get(urlResourceFileDefaultLanguage, httpGetConfig).then(function (response) {
                    dictionaryDefaultLanguage = response.data;
                }).catch(function (error) {
                    throw new Error("Fail internationalisation: " + error.message);
                });
            }

            function getDictionaryItem(dictionary, dictionaryKey) {
                if (dictionary !== null && dictionary !== undefined && dictionary.hasOwnProperty(dictionaryKey)) {
                    var item = dictionary[dictionaryKey];
                    return item === null || item === undefined ? null : item;
                }

                return null;
            }

            initLocalizedResources();

            return i18nService;
        }]
    }
);

angular.module('verklizan.umox.common.html5.vkz-utilities.localisation').directive('ngBindWithDefault',
    ['$rootScope', 'localisationService', function ($rootScope, localisationService) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                evaluatedBindingValue: "=ngBindWithDefault",
                defaultLocalizedKey: "@prDefaultLocalizedKey"
            },
            template: '{{localisedString}}',           
            link: function (scope, element, attributes) {                
                scope.localisedString = "";
                
                scope.$watch(function () { return scope.evaluatedBindingValue; }, function (newValue, oldValue) {
                    if (newValue) {
                        scope.localisedString = newValue;
                    }
                    else {
                        getLocalizedString(scope.defaultLocalizedKey);
                    }
                });

                function getLocalizedString(localisationKey) {
                    localisationService.getLocalizedStringAsync(localisationKey).then(function (localisationValue) {
                        scope.localisedString = localisationValue;
                    });
                }                
            }
        };

    }]);
'use strict';

/**
 * @ngdoc service
 * @name CordovaUTIL.instanceGUIDService
 * @requires CordovaUTIL.Dictionary
 *
 * @description
 * The service is responsible for providing 
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.settings').service('instanceGUIDService',
    ['$window', 'settingsService', 'utilities', function ($window, settingsService, utilities) {

        /**
         * @ngdoc method
         * @name createOrRetrieveInstanceGUID
         * @methodOf CordovaUTIL.instanceGUIDService
         * @returns {array} a GUID which will be unique for the client generated on first app/browser run.
         * @description
         * Creates or returns a unique Id which will be generated and saved in local storage the first time the app runs on a device.
        */
        this.createOrRetrieveInstanceGUID = function () {
            var instanceGUID = settingsService.getInstanceGUID();

            if ($window.isNullOrUndefined(instanceGUID)) {
                instanceGUID = utilities.createUniqueId();
                settingsService.setInstanceGUID(instanceGUID);
            }

            return instanceGUID;
        }
    }]
);

/**
 * @ngdoc service
 * @name CordovaUTIL.settings.languageSettingsServiceProvider
 * @requires CordovaUTIL.settings.settingsDomain
 * @requires CordovaUTIL.settings.settingsService
 *
 * @description
 * The provider of the languageSettingsService. Give the feature to not use localstorage for the language,
 * but to retrieve the language from the browserSettings. 
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.settings').provider('languageSettingsService',
    function () {
        var useBrowserLanguage = false;

        /**
         * @ngdoc method
         * @name CordovaUTIL.settings.languageSettingsServiceProvider#useBrowserLanguage
         * @methodOf CordovaUTIL.settings.languageSettingsServiceProvider
         *
         * @description
         * Will result in that getLanguage not retrieves the language from localstorage, but from browser settings.
        */
        this.useBrowserLanguage = function () {
            useBrowserLanguage = true;
        }

        /**
         * @ngdoc service
         * @name CordovaUTIL.settings.languageSettingsService
         * @requires CordovaUTIL.settings.settingsDomain
         * @requires CordovaUTIL.settings.settingsService
         *
         * @description
         * A service on top of the settingsService to provide function to access the baseUrl as wel as validating methods.
        */
        this.$get = ['$window', 'settingsService', 'settingsDomain', function ($window, settingsService, settingsDomain) {
            var languageSettingsService = {};

            /**
             * @ngdoc method
             * @name CordovaUTIL.settings.languageSettingsService#getLanguage
             * @methodOf CordovaUTIL.settings.languageSettingsService
             * @returns {String} Language that represents the used language in the application.  
             *
             * @description
             * Gets the language, which can be from the localstorage (default) or the language of the browser.
            */
            languageSettingsService.getLanguage = function () {
                var language;

                if (useBrowserLanguage) {
                    language = $window.navigator.userLanguage || $window.navigator.language;
                } else {
                    language = settingsService.getLanguage();
                }

                return language;
            }

            /**
             * @ngdoc method
             * @name CordovaUTIL.settings.languageSettingsService#setLanguage
             * @methodOf CordovaUTIL.settings.languageSettingsService
             * @param {string} Language that represents the new language set.
             *
             * @description
             * Saves the language to localstorage. Does not work when 'useBrowserLanguage' is used, and will throw an exception.
            */
            languageSettingsService.setLanguage = function (newLanguage) {
                if (useBrowserLanguage) {
                    throw new Error("Not possible to set language if you use the browser language");
                }

                settingsService.setLanguage(newLanguage);
            }

            return languageSettingsService;
        }]
    });

angular.module('verklizan.umox.common.html5.vkz-utilities.settings').provider('pomasUrlSettingsService',
    function () {

        this.$get = ['settingsService', 'settingsDomain', function (settingsService, settingsDomain) {
            var pomasUrlSettingsService = {};

            pomasUrlSettingsService.getBaseUrlObject = function () {
                var pomasBaseUrlObject = settingsService.getPomasBaseUrl();

                if (pomasBaseUrlObject === null || typeof pomasBaseUrlObject === "undefined") {
                    pomasBaseUrlObject = new settingsDomain.URL();
                }

                return pomasBaseUrlObject;
            };

            pomasUrlSettingsService.setBaseUrlObject = function (host, port) {
                var newBaseUrl = new settingsDomain.URL(host, port, "pomas");

                settingsService.setPomasBaseUrl(newBaseUrl);
            };

            return pomasUrlSettingsService;
        }];
    }
);

/**
 * @ngdoc service
 * @name CordovaUTIL.settings.settingsDomain
 * @requires CordovaUTIL.storage.cachedLocalStorageService
 *
 * @description
 * The settingsDomain provides the domain for settings related object. 
 * This object should generally not be used outside the library, and is because of this not documented further.
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.settings').factory('settingsDomain',
    ['cachedLocalStorageService', 'cachedSessionStorageService', function (cachedLocalStorageService, cachedSessionStorageService) {
        var settingsDomain = {};

        settingsDomain.Setting = function (_name, _options) {
            var that = this;
            this.name = _name;
            this.options = _options || {};

            var storageMapping = {
                local: {
                    getItem: cachedLocalStorageService.getLocalStorageItem,
                    setItem: cachedLocalStorageService.setLocalStorageItem,
                    removeItem: cachedLocalStorageService.removeLocalStorageItem
                },
                session: {
                    getItem: cachedSessionStorageService.getSessionStorageItem,
                    setItem: cachedSessionStorageService.setSessionStorageItem,
                    removeItem: cachedSessionStorageService.removeSessionStorageItem
                }
            }


            this.get = function () {
                var valueFromStorage = getStorage().getItem(this.name);

                if (valueFromStorage === null) {
                    return this.options.defaultValue;
                }
                else {
                    if (this.options.needsParsing) {
                        return JSON.parse(valueFromStorage);
                    }
                    else {
                        return valueFromStorage;
                    }
                }
            }

            this.set = function (settingValue) {
                if (this.options.needsParsing) {
                    settingValue = JSON.stringify(settingValue);
                }

                getStorage().setItem(this.name, settingValue);
            }

            this.clear = function () {
                getStorage().removeItem(this.name);
            }

            function getStorage() {
                if(that.options.isTemporarily  === true) {
                    return storageMapping.session;
                }
                else {
                    return storageMapping.local;
                }
            }
        }

        settingsDomain.URL = function (host, port, path) {
            this.host = host;
            this.port = port;
            this.path = path;
        }

        return settingsDomain;
    }]
);

/**
 * @ngdoc service
 * @name CordovaUTIL.settings.settingsServiceProvider
 * @requires CordovaUTIL.settings.settingsDomain
 *
 * @description
 * The provider of the settingsService which gives the option to add the settings to the service.
 * The settingsService will create getters, setters and clean methods for every setting that is given.
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.settings').provider('settingsService',
    function () {
        var includedSettings = [
            { name: "BaseUrl", options: { needsParsing: true } },
            { name: "PomasBaseUrl", options: { needsParsing: true } },
            { name: "Language" },
            { name: "InstanceGUID" },
            { name: "ApplicationName" },
            { name: "ApplicationVersion" }
        ];

        /**
         * @ngdoc method
         * @name CordovaUTIL.settings.settingsServiceProvider#addSettings
         * @methodOf CordovaUTIL.settings.settingsServiceProvider
         * @param {array} Settings is a list of settings to add. See {@link settings.settingsServiceProvider#addSetting} for more details.
         *
         * @description
         * Adds multiple settings to the settingsService
        */
        this.addSettings = function (settings) {
            includedSettings = includedSettings.concat(settings);
        }

        /**
         * @ngdoc method
         * @name CordovaUTIL.settings.settingsServiceProvider#addSetting
         * @methodOf CordovaUTIL.settings.settingsServiceProvider
         * @param {object} Setting to add to the settingsService. 
         *
         * @description
         * Adds a single setting to the settingsService
         * 
         * Object properties:
         * 
         * - `name` defines the name that is used for the setting. Usually upper case is used for the settings name. The name will be used to create the
         *   getter, setter and clean methods. For example for the setting with the name 'BaseUrl', the settingsService will create a method 'getBaseUrl', 
         *   'setBaseUrl' and 'cleanBaseUrl'.
         * - `options`
         *  - `defaultValue` is the default value that will be returned if there is no setting in the local storage present.
         *  - `isTemporarily` will make the saved setting disappear after the browser is restarted. Ideal for security tokens from logging in.
         *  - `needsParsing` when set to true, will always stringify and parse the setting as json. This is necessary when the setting you want to save is an object, instead of a simple string, integer or boolean.
        */
        this.addSetting = function (setting) {
            includedSettings.push(setting);
        }

        /**
        * @ngdoc service
        * @name CordovaUTIL.settings.settingsService
        * @requires CordovaUTIL.settings.settingsDomain
        *
        * @description
        * The settingsService will create a method for every setting that is passed on to the settingsServiceProvider. 
        * For every setting there will be dynamically added a method with the setting name as suffix. For example for the 
        * setting 'BaseUrl' the following methods will be created:
        * - getBaseUrl();
        * - setBaseUrl(newValue);
        * - clearBaseUrl();
        */
        this.$get = ['cachedLocalStorageService', 'settingsDomain', function (cachedLocalStorageService, settingsDomain) {
            var settingsService = {};

            // ============================
            // Initialization
            // ============================
            for (var i = 0; i < includedSettings.length; i++) {
                var currentSetting = includedSettings[i];

                var parsedSetting = new settingsDomain.Setting(currentSetting.name, currentSetting.options);

                createCrudFunctionsForSetting(parsedSetting);
            }

            function createCrudFunctionsForSetting(setting) {
                settingsService["get" + setting.name] = function () {
                    return setting.get();
                }

                settingsService["set" + setting.name] = function (newValue) {
                    setting.set(newValue);
                }

                settingsService["clear" + setting.name] = function () {
                    setting.clear();
                }
            }

            return settingsService;
        }]
    }
);

/**
 * @ngdoc service
 * @name CordovaUTIL.settings.urlSettingsService
 * @requires CordovaUTIL.settings.settingsDomain
 * @requires CordovaUTIL.settings.settingsService
 *
 * @description
 * A service on top of the settingsService to provide function to access the baseUrl as wel as validating methods.
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.settings').provider('urlSettingsService',
    function () {
        var splitName = false;

        /**
         * @ngdoc method
         * @name useRelativePath
         * @methodOf CordovaUTIL.settings.urlSettingsService
         *
         * @description
         * Passes the string which is part of the url through which can be determined whether a relative path should be used or not
        */
        this.useRelativePath = function (splitNameParam) {
            splitName = splitNameParam;
        };

        this.$get = ['settingsService', 'settingsDomain', '$location', function (settingsService, settingsDomain, $location) {
            var urlSettingsService = {};

            /**
             * @ngdoc method
             * @name getBaseUrlObject
             * @methodOf CordovaUTIL.settings.urlSettingsService
             * @returns {object} UrlObject that is the same representation that is saved in the settingsService.
             *
             * @description
             * Gets the original base url object as is present in local storage.
            */
            urlSettingsService.getBaseUrlObject = function () {
                var baseUrlObject = settingsService.getBaseUrl();

                if (baseUrlObject === null || typeof baseUrlObject === "undefined") {
                    baseUrlObject = new settingsDomain.URL();
                }

                return baseUrlObject;
            };

            /**
             * @ngdoc method
             * @name setBaseUrlObject
             * @methodOf CordovaUTIL.settings.urlSettingsService
             * @param {string} host required host of the url.
             * @param {string} port optional port of the url.
             * @param {string} path required path of the url.
             *
             * @description
             * Saves the url give.
            */
            urlSettingsService.setBaseUrlObject = function (host, port, path) {
                var newBaseUrl = new settingsDomain.URL(host, port, path);

                settingsService.setBaseUrl(newBaseUrl);
            };

            /**
             * @ngdoc method
             * @name getBaseUrl
             * @methodOf CordovaUTIL.settings.urlSettingsService
             * @returns {string} string representation of the url.
             *
             * @description
             * Returns formatted url which is usable for routing and creating web requests.
            */
            urlSettingsService.getBaseUrl = function () {
                if (splitName) {
                    var currentUrl = $location.absUrl().toLowerCase();
                    var splittedPath = currentUrl.split(splitName.toLowerCase());
                    return splittedPath[0].slice(0, -1);
                }
                else {
                    var baseUrlObject = this.getBaseUrlObject();

                    if (baseUrlObject) {
                        return baseUrlObject.host + (baseUrlObject.port ? ":" + baseUrlObject.port : "") + "/" + baseUrlObject.path;
                    }
                }
            };

            /**
             * @ngdoc method
             * @name hasValidBaseUrl
             * @methodOf CordovaUTIL.settings.urlSettingsService
             * @returns {bool} Returns if the current saved base url is a valid base url.
             *
             * @description
             * Returns if the current saved base url is a valid base url.
            */
            urlSettingsService.hasValidBaseUrl = function () {
                var currentBaseUrl = urlSettingsService.getBaseUrlObject();

                if (!currentBaseUrl.host || !currentBaseUrl.path) {
                    return false;
                } else {
                    return true;
                }
            };

            return urlSettingsService;
        }];
    }
);

/**
 * @ngdoc service
 * @name CordovaUTIL.storage.cachedLocalStorageService
 * @requires $window
 *
 * @description
 * Interface for the window.localStorage functions
 *
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.storage').service('cachedLocalStorageService',
    ['$window', function ($window) {
        'use strict';

        // ============================
        // Private fields
        // ============================
        var dictionary = {};

        // ============================
        // Public methods
        // ============================
        /**
         * @ngdoc method
         * @name getLocalStorageItem
         * @methodOf CordovaUTIL.storage.cachedLocalStorageService
         * @param {string} key the key of a local storage item
         * @returns {string} returns the value belonging to this key. Returns null when not found.
         *
         * @description
         * Gets the local storage item out the window.localStorage.
        */
        this.getLocalStorageItem = function (key) {
            if (typeof getItem(key) === 'undefined') {
                setItem(key, $window.localStorage.getItem(key));
            }

            return getItem(key);
        }

        /**
         * @ngdoc method
         * @name setLocalStorageItem
         * @methodOf CordovaUTIL.storage.cachedLocalStorageService
         * @param {string} key key for the local storage item.
         * @param {string} value value for the local storage item.
         *
         * @description
         * Sets a local storage item with the key and value in the window.localStorage.
        */
        this.setLocalStorageItem = function (key, value) {
            $window.localStorage.setItem(key, value);
            setItem(key, value);
        }

        /**
         * @ngdoc method
         * @name removeLocalStorageItem
         * @methodOf CordovaUTIL.storage.cachedLocalStorageService
         * @param {string} key The key for which local storage item has to be deleted.
         * 
         * @description
         * Deletes a local storage item from the window.localStorage based on the key.
        */
        this.removeLocalStorageItem = function (key) {
            $window.localStorage.removeItem(key);
            delete dictionary[key];
        }

        // ============================
        // Private methods
        // ============================
        var getItem = function (key) {
            return dictionary[key];
        };

        var setItem = function (key, value) {
            dictionary[key] = value;
        };
    }]
);

/**
 * @ngdoc service
 * @name CordovaUTIL.storage.cachedLocalStorageService
 * @requires $window
 *
 * @description
 * Interface for the window.localStorage functions
 *
*/
angular.module('verklizan.umox.common.html5.vkz-utilities.storage').service('cachedSessionStorageService',
    ['$window', function ($window) {
        'use strict';

        // ============================
        // Private fields
        // ============================
        var dictionary = {};

        // ============================
        // Public methods
        // ============================
        /**
         * @ngdoc method
         * @name getLocalStorageItem
         * @methodOf CordovaUTIL.storage.cachedLocalStorageService
         * @param {string} key the key of a local storage item
         * @returns {string} returns the value belonging to this key. Returns null when not found.
         *
         * @description
         * Gets the local storage item out the window.localStorage.
        */
        this.getSessionStorageItem = function (key) {
            if (typeof getItem(key) === 'undefined') {
                setItem(key, $window.sessionStorage.getItem(key));
            }

            return getItem(key);
        }

        /**
         * @ngdoc method
         * @name setLocalStorageItem
         * @methodOf CordovaUTIL.storage.cachedLocalStorageService
         * @param {string} key key for the local storage item.
         * @param {string} value value for the local storage item.
         *
         * @description
         * Sets a local storage item with the key and value in the window.localStorage.
        */
        this.setSessionStorageItem = function (key, value) {
            $window.sessionStorage.setItem(key, value);
            setItem(key, value);
        }

        /**
         * @ngdoc method
         * @name removeLocalStorageItem
         * @methodOf CordovaUTIL.storage.cachedLocalStorageService
         * @param {string} key The key for which local storage item has to be deleted.
         * 
         * @description
         * Deletes a local storage item from the window.localStorage based on the key.
        */
        this.removeSessionStorageItem = function (key) {
            $window.sessionStorage.removeItem(key);
            delete dictionary[key];
        }

        // ============================
        // Private methods
        // ============================
        var getItem = function (key) {
            return dictionary[key];
        };

        var setItem = function (key, value) {
            dictionary[key] = value;
        };
    }]
);
