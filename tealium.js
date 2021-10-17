//tealium universal tag - utag.loader ut4.0.202004272140, Copyright 2020 Tealium.com Inc. All Rights Reserved.
var utag_condload = false;
try {
  (function () {
    function ul(src, a, b) {
      a = document;
      b = a.createElement("script");
      b.language = "javascript";
      b.type = "text/javascript";
      b.src = src;
      a.getElementsByTagName("head")[0].appendChild(b);
    }
    if (
      ("" + document.cookie).match(
        "utag_env_usbank_digital-banking=(//tags.tiqcdn.com/utag/usbank/[^S;]*)"
      )
    ) {
      if (RegExp.$1.indexOf("/dev/") === -1) {
        var s = RegExp.$1;
        while (s.indexOf("%") != -1) {
          s = decodeURIComponent(s);
        }
        s = s.replace(/\.\./g, "");
        ul(s);
        utag_condload = true;
        __tealium_default_path =
          "//tags.tiqcdn.com/utag/usbank/digital-banking/dev/";
      }
    }
  })();
} catch (e) {}
try {
  try {
    window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
    window.utag_cfg_ovrd.noview = true;
    window.publisherFW = {
      __debug: true,
      __debugMessage: function (msg) {
        var debugFlag = true;
        if (this.__debug) {
          if (typeof console !== "undefined") {
            if (typeof console.log === "function") {
              console.log(msg);
            }
          }
        }
      },
      __timing: false,
      __timingMessage: function (msg) {
        if (this.__timing) {
          if (typeof console !== "undefined") {
            if (typeof console.log === "function") {
              console.log("PublisherFW Timing: " + msg);
            }
          }
        }
      },
      __listeners: {},
      __data: {},
      __eventQueue: {},
      __listenerQueue: {},
      __flushQueue: function (id) {
        var eventData = this.__eventQueue[id];
        if (typeof eventData !== "undefined") {
          for (var i = 0, numEvents = eventData.length; i < numEvents; i++) {
            this.publishEvent(id, eventData[i]);
          }
        }
      },
      __processEvent: function (id, data) {
        var queueEvent = false;
        if (this.__queueDependencies[id]) {
          queueEvent = true;
          if (typeof this.__eventQueue[id] === "undefined") {
            this.__eventQueue[id] = [];
          }
          this.__eventQueue[id].push(data);
        }
        return queueEvent;
      },
      __queueDependencies: {
        pageView: { SiteCatalyst: false },
        drawerOpen: { SiteCatalyst: false, WebTrends: true },
      },
      __processDependency: function (title, id) {
        this.__debugMessage("Processing Dependency: " + title + ", " + id);
        var dependencies = this.__queueDependencies[id];
        if (typeof dependencies === "object" && dependencies[title] === false) {
          var dependenciesFulfilled = true;
          for (var dependencyTitle in dependencies) {
            if (title === dependencyTitle) {
              dependencies[dependencyTitle] = true;
            }
            dependenciesFulfilled =
              dependenciesFulfilled && dependencies[dependencyTitle];
          }
          if (dependenciesFulfilled) {
            this.__queueDependencies[id] = false;
            this.__flushQueue(id);
          }
        }
      },
      __dataMatches: function (data1, data2, reverseCompared) {
        for (var key in data1) {
          if (typeof data1[key] === typeof data2[key]) {
            var type = typeof data1[key];
            if (type === "object") {
              if (!this.__dataMatches(data1[key], data2[key], false)) {
                return false;
              }
            } else {
              if (data1[key] !== data2[key]) {
                return false;
              }
            }
          } else {
            return false;
          }
        }
        if (!reverseCompared && !this.__dataMatches(data2, data1, true)) {
          return false;
        }
        return true;
      },
      __validateThrottling: function (id, data) {
        var config = this.__validationConfig.Throttling;
        if (typeof config.eventTimes[id] === "undefined") {
          config.eventTimes[id] = { data: data, executionTime: new Date() };
          return;
        }
        var currentTime = new Date(),
          timeSinceLastEvent =
            currentTime - config.eventTimes[id].executionTime;
        if (
          timeSinceLastEvent < config.threshold &&
          this.__dataMatches(config.eventTimes[id].data, data, false)
        ) {
          this.__validationErrors.valid = false;
        } else {
          config.eventTimes[id] = { data: data, executionTime: new Date() };
        }
      },
      __validationErrors: { valid: true, errors: {} },
      __addValidationError: function (type, name, method, validity) {
        if (typeof this.__validationErrors.errors[type] === "undefined") {
          this.__validationErrors.errors[type] = [];
        }
        if (typeof validity !== "undefined") {
          this.__validationErrors.valid =
            this.__validationErrors.valid && validity;
        }
        this.__validationErrors.errors[type].push({
          name: name,
          method: method,
        });
      },
      __validationConfig: {
        PIINPI: {
          detectionLogic: {
            PhoneNumber: /(\(\d{3}\)|\d{3})( |)\d{3}\-\d{4}/,
            Email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/,
            SSN: /\d{3}\-\d{2}\-\d{4}/,
            CCN: /\d{4}\-\d{4}\-\d{4}\-\d{4}/,
          },
        },
        DataLength: { maxLength: 1000, trimAndSend: true },
        Throttling: { threshold: 100, eventTimes: {} },
      },
      __validationRules: {
        "PII-NPI": function (name, datum) {
          var config = this.__validationConfig["PIINPI"];
          for (var method in config.detectionLogic) {
            if (typeof datum === "string") {
              if (config.detectionLogic[method].test(datum)) {
                this.__addValidationError("PII-NPI", name, method, false);
              }
            }
          }
          return datum;
        },
        DataLength: function (name, datum) {
          var config = this.__validationConfig["DataLength"];
          if (typeof datum === "string") {
            if (datum.length > config.maxLength) {
              if (config.trimAndSend) {
                datum = datum.substring(0, config.maxLength);
                this.__addValidationError(
                  "DataLength",
                  name,
                  "MaxLength",
                  true
                );
              } else {
                this.__addValidationError(
                  "DataLength",
                  name,
                  "MaxLength",
                  false
                );
              }
            }
          }
          return datum;
        },
      },
      addListenerMap: function (title, map) {
        var idsAdded = [];
        for (var id in map) {
          if (map.hasOwnProperty(id)) {
            if (typeof this.__listeners[id] === "undefined") {
              this.__listeners[id] = {};
            }
            this.__listeners[id][title] = map[id];
            idsAdded.push(id);
          }
          this.__processDependency(title, id);
        }
        this.__debugMessage(
          "Listener map added for '" +
            title +
            "' for following IDs:\n\t" +
            idsAdded.join("\n\t")
        );
      },
      publishEvent: function (id, data) {
        if (typeof this.__listenerQueue[id] === "undefined") {
          this.__listenerQueue[id] = [];
        }
        this.__listenerQueue[id].push(data);
        this.__debugMessage(
          "PublishEvent Function Call Start ID:" + id + "\n\t"
        );
        this.__debugMessage(data);
        if (this.__processEvent(id, data)) {
          return;
        }
        var validationStartTime = new Date();
        this.__data[id] = this.validateData(id, data, true);
        data = this.__data[id];
        var validationEndTime = new Date();
        this.__timingMessage(
          "Validation time for data set: " +
            (validationEndTime - validationStartTime) +
            " ms"
        );
        this.handleValidationErrors();
        var listeners = this.__listeners[id];
        if (!this.__validationErrors.valid) {
          this.__debugMessage(
            "Data deemed invalid.  Skipping listener execution."
          );
          return;
        }
        if (typeof listeners !== "undefined") {
          for (var title in listeners) {
            try {
              if (listeners[title].isEnabled) {
                var listenerStartTime = new Date();
                listeners[title].track(data);
                var listenerStopTime = new Date();
                this.__timingmessage(
                  "Execution time for listener '" +
                    title +
                    "' for event '" +
                    id +
                    "': " +
                    (listenerStopTime - listenerStartTime) +
                    " ms"
                );
              } else {
              }
            } catch (e) {}
          }
        }
      },
      validateData: function (id, data, testThrottling) {
        this.resetValidationErrors();
        for (var key in data) {
          var keyStartTime = new Date();
          for (var rule in this.__validationRules) {
            try {
              var oldData = data[key];
              if (typeof data[key] === "object") {
                data[key] = this.validateData(id, data[key], false);
              } else {
                data[key] = this.__validationRules[rule].apply(this, [
                  key,
                  data[key],
                ]);
              }
              if (oldData !== data[key]) {
              }
            } catch (e) {}
          }
          var keyStopTime = new Date();
          this.__timingMessage(
            "Validation time for '" +
              key +
              "': " +
              (keyStopTime - keyStartTime) +
              " ms"
          );
        }
        if (testThrottling) {
          var throttlingStartTime = new Date();
          this.__validateThrottling(id, data);
          var throttlingStopTime = new Date();
          this.__timingMessage(
            "Validation time for Throttling: " +
              (throttlingStopTime - throttlingStartTime) +
              " ms"
          );
        }
        return data;
      },
      handleValidationErrors: function () {
        var typeErrors = this.__validationErrors.errors;
        for (var type in typeErrors) {
          for (
            var i = 0, numErrors = typeErrors[type].length;
            i < numErrors;
            i++
          ) {}
        }
      },
      resetValidationErrors: function () {
        this.__validationErrors = { valid: true, errors: {} };
      },
    };
    window.publisherFW.scFM = {
      trackCall: function (o, tx) {
        utag.link(this.transformDataForUtag(o));
      },
      pageViewCall: function (o) {
        utag.view(this.transformDataForUtag(o));
      },
      setTaxonomy: function (data) {},
      transformDataForUtag: function (data) {
        var tmp_utag_obj = {};
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            tmp_utag_obj["adobe_" + key.toLowerCase()] = data[key];
          }
        }
        if (typeof tmp_utag_obj["adobe.events"] != "undefined") {
          var events_array = tmp_utag_obj["adobe.events"].split(",");
          for (var i = 0; i < events_array.length; i++) {
            tmp_utag_obj["adobe_" + events_array[i]] = "1";
          }
          delete tmp_utag_obj["adobe_events"];
        }
        console.log("Testing3");
        console.log(tmp_utag_obj);
        return tmp_utag_obj;
      },
    };
  } catch (e) {
    utag.DB(e);
  }
} catch (e) {}
if (!utag_condload) {
  try {
    try {
      var Utagger = typeof window.Utagger != "undefined" ? window.Utagger : {};
      window.Utagger = Utagger;
      window.setCookie = function (a, c, b) {
        document.cookie =
          a +
          "\x3d" +
          encodeURIComponent(c) +
          (b ? ";expires\x3d" + b : "") +
          ";path\x3d/;domain\x3d" +
          this.domain;
        return this.get(a) == c;
      };
      window.Utagger.setCookie = function (a, c, b) {
        document.cookie =
          a +
          "\x3d" +
          encodeURIComponent(c) +
          (b ? ";expires\x3d" + b : "") +
          ";path\x3d/;domain\x3d" +
          window.domain;
        return true;
      };
      window.setCookie = window.Utagger.setCookie = function () {};
      window.Utagger.getCookie = function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
      };
      window.Utagger.getDeviceName = function () {
        try {
          if (/Mobi|Tablet|Android|KFAPWI/.test(navigator.userAgent)) {
            var ua = navigator.userAgent;
            var mobile_device_name = "";
            var mobile_checker = {
              iphone: ua.match(/iPhone/),
              ipad: ua.match(/iPad/),
              android: ua.match(/Android/),
              windows: ua.match(/Windows\sPhone/),
              blackBerry: ua.match(/BlackBerry|BB|playbook/i),
            };
            if (mobile_checker.windows) {
              mobile_device_name = "wap:windows phone";
            } else if (mobile_checker.android) {
              mobile_device_name = "wap:android";
            } else if (mobile_checker.ipad) {
              mobile_device_name = "wap:ipad";
            } else if (mobile_checker.iphone) {
              mobile_device_name = "wap:iphone";
            } else if (mobile_checker.blackBerry) {
              mobile_device_name = "wap:blackBerry";
            } else {
              mobile_device_name = "wap:base";
            }
            return mobile_device_name;
          }
        } catch (e) {
          console.log(e + "Error data layer deviceName");
        }
      };
      window.Utagger.imageRequest = function (a) {
        var c = new Image(0, 0);
        c.src = a;
        return c;
      };
      window.Utagger.insightSensor = function () {
        if (
          typeof s != "undefined" &&
          typeof utag.data["insight_uid"] != "undefined"
        ) {
          utag.view({}, null, [utag.data["insight_uid"]]);
        }
      };
      window.Utagger.safeIframeInsert = function (u) {
        var newFrame = document.createElement("iframe");
        newFrame.src = u;
        newFrame.width = newFrame.height = "1px";
        newFrame.style.display = "none";
        var rand = parseInt(1e5 * 1e4 * Math.random() * Math.random());
        window.Utagger["appendFrame" + rand] = setInterval(
          (function (a, b) {
            return function () {
              document.getElementsByTagName("body") &&
                0 < document.getElementsByTagName("body").length &&
                (clearInterval(window.Utagger["appendFrame" + b]),
                document.getElementsByTagName("body")[0].appendChild(a));
            };
          })(newFrame, rand),
          250
        );
      };
      window.Utagger.p_c = function (v, c) {
        var x = v.indexOf("=");
        return c.toLowerCase() ==
          v.substring(0, x < 0 ? v.length : x).toLowerCase()
          ? v
          : 0;
      };
      window.Utagger.fl = function (x, l) {
        return x ? ("" + x).substring(0, l) : x;
      };
      window.Utagger.pt = function (x, d, f, a) {
        var s = this,
          t = x,
          z = 0,
          y,
          r;
        while (t) {
          y = t.indexOf(d);
          y = y < 0 ? t.length : y;
          t = t.substring(0, y);
          r = s[f](t, a);
          if (r) return r;
          z += y + d.length;
          t = x.substring(z, x.length);
          t = z < x.length ? t : "";
        }
        return "";
      };
      window.Utagger.getPageName = function (u) {
        var s = this,
          v = u ? u : "" + window.location,
          x = v.indexOf(":"),
          y = v.indexOf("/", x + 4),
          z = v.indexOf("?"),
          c = ":",
          e = "",
          g = "",
          d = utag.data.adobe_site_id,
          n = d ? d : "",
          q = z < 0 ? "" : v.substring(z + 1),
          p = v.substring(y + 1, q ? z : v.length);
        z = p.indexOf("#");
        p = z < 0 ? p : window.Utagger.fl(p, z);
        x = e ? p.indexOf(e) : -1;
        p = x < 0 ? p : window.Utagger.fl(p, x);
        p += !p || p.charAt(p.length - 1) == "/" ? "" : "";
        y = c ? c : "/";
        while (p) {
          x = p.indexOf("/");
          x = x < 0 ? p.length : x;
          z = window.Utagger.fl(p, x);
          if (!window.Utagger.pt("", ",", "p_c", z)) n += n ? y + z : z;
          p = p.substring(x + 1);
        }
        y = c ? c : "?";
        while (g) {
          x = g.indexOf(",");
          x = x < 0 ? g.length : x;
          z = window.Utagger.fl(g, x);
          z = window.Utagger.pt(q, "&", "p_c", z);
          if (z) {
            n += n ? y + z : z;
            y = c ? c : "&";
          }
          g = g.substring(x + 1);
        }
        return n;
      };
      window.Utagger.loadScriptCallback = function (a, c, b) {
        var d = document.getElementsByTagName("script"),
          e;
        b = d[0];
        for (e = 0; e < d.length; e++)
          if (
            d[e].src === a &&
            d[e].readyState &&
            /loaded|complete/.test(d[e].readyState)
          )
            try {
              c();
            } catch (g) {
              utag.DB(g);
            } finally {
              return;
            }
        d = document.createElement("script");
        d.type = "text/javascript";
        d.async = !0;
        d.src = a;
        d.onerror = function () {
          this.addEventListener && (this.readyState = "loaded");
        };
        d.onload = d.onreadystatechange = function () {
          if (
            !this.readyState ||
            "complete" === this.readyState ||
            "loaded" === this.readyState
          ) {
            this.onload = this.onreadystatechange = null;
            this.addEventListener && (this.readyState = "loaded");
            try {
              c.call(this);
            } catch (g) {
              utag.DB(g);
            }
          }
        };
        b.parentNode.insertBefore(d, b);
      };
      window.Utagger.insertScript = function (a, c, d, h) {
        var p = document.getElementsByTagName("script"),
          g;
        h = void 0 !== h ? h : !0;
        if (void 0 !== c ? c : 1)
          for (g = 0; g < p.length; g++)
            if (
              p[g].src === a &&
              p[g].readyState &&
              /loaded|complete/.test(p[g].readyState)
            )
              return;
        if (d) {
          d = 1 == d && "object" == typeof b.scDataObj ? b.scDataObj : d;
          e.rand = Math.random() * ("1E" + (10 * Math.random()).toFixed(0));
          c = window.location.href;
          "object" === typeof d &&
            d.PageID &&
            ((c = d.PageID), delete d.PageID);
          if ("object" === typeof d)
            for (g in d) {
              g = ~c.indexOf("#") ? c.slice(c.indexOf("#"), c.length) : "";
              c = c.slice(0, g.length ? c.length - g.length : c.length);
              c += ~c.indexOf("?") ? "&" : "?";
              for (k in d) c += k + "=" + d[k] + "&";
              c = c.slice(0, -1) + g;
              break;
            }
          a += "?";
          h && (a += "r=" + e.rand + "&");
          a +=
            "ClientID=" +
            encodeURIComponent(e.options.clientId) +
            "&PageID=" +
            encodeURIComponent(c);
        }
        (function (a, c, b) {
          var d = c.head || c.getElementsByTagName("head");
          setTimeout(function () {
            if ("item" in d) {
              if (!d[0]) {
                setTimeout(arguments.callee, 25);
                return;
              }
              d = d[0];
            }
            var a = c.createElement("script");
            a.src = b;
            a.onload = a.onerror = function () {
              this.addEventListener && (this.readyState = "loaded");
            };
            d.insertBefore(a, d.firstChild);
          }, 0);
        })(window, document, a);
      };
      window.Utagger.marketingSocialTags = {
        createFacebookPixel: function (
          init,
          track,
          content_name,
          content_category
        ) {
          if (typeof window.fbq == "undefined") {
            !(function (f, b, e, v, n, t, s) {
              if (f.fbq) return;
              n = f.fbq = function () {
                n.callMethod
                  ? n.callMethod.apply(n, arguments)
                  : n.queue.push(arguments);
              };
              if (!f._fbq) f._fbq = n;
              n.push = n;
              n.loaded = !0;
              n.version = "2.0";
              n.queue = [];
              t = b.createElement(e);
              t.async = !0;
              t.src = v;
              s = b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t, s);
            })(
              window,
              document,
              "script",
              "//connect.facebook.net/en_US/fbevents.js"
            );
            fbq("init", init);
          }
          if (track == "PageView") fbq("track", "PageView");
          else
            fbq("track", track, {
              content_name: content_name,
              content_category: content_category,
            });
        },
        createAdwordsPixel: function (id, label, remarketing) {
          var googleObj = {};
          if (remarketing == true)
            googleObj = {
              google_conversion_id: id,
              google_custom_params: window.google_tag_params,
              google_remarketing_only: remarketing,
            };
          else
            googleObj = {
              google_conversion_id: id,
              google_conversion_language: "en",
              google_conversion_format: "3",
              google_conversion_color: "ffffff",
              google_conversion_label: label,
              google_remarketing_only: remarketing,
            };
          if (typeof window.google_trackConversion != "function")
            window.Utagger.loadScriptCallback(
              "//www.googleadservices.com/pagead/conversion_async.js",
              function () {
                window.google_trackConversion(googleObj);
              }
            );
          else window.google_trackConversion(googleObj);
        },
        createDCMPixel: function (type, cat) {
          window.Utagger.imageRequest(
            "//ad.doubleclick.net/ddm/activity/src\x3d6219543;type\x3d" +
              type +
              ";cat\x3d" +
              cat +
              ";dc_lat\x3d;dc_rdid\x3d;tag_for_child_directed_treatment\x3d;ord\x3d" +
              (Math.random() + "") * 1e13 +
              "?"
          );
        },
      };
      window.Utagger.propertyWatcher = (function (options) {
        var _private = { watchers: [] },
          _public = {};
        _private.options = options || {};
        _private.options.interval = _private.options.interval || 50;
        _private.Watcher = function (propertyFn, options) {
          var _public = {};
          _public.propertyFn = propertyFn;
          _public.lastValue = undefined;
          _public.options = options;
          _public.change = function (oldVal, newVal) {};
          return _public;
        };
        _private.doChecks = function () {
          for (var i = 0; i < _private.watchers.length; i++) {
            var w = _private.watchers[i],
              p = w.propertyFn ? w.propertyFn() : null;
            if (w.lastValue != p) {
              w.change(w.lastValue, p);
              w.lastValue = p;
            }
          }
          _private.resetTimer();
        };
        _private.resetTimer = function () {
          window.setTimeout(function () {
            _private.doChecks();
          }, _private.options.interval);
        };
        _private.addWatcher = function (fn, options) {
          var w = _private.Watcher(fn, options);
          _private.watchers.push(w);
          return w;
        };
        _public = { create: _private.addWatcher };
        _private.doChecks();
        return _public;
      })();
    } catch (e) {
      utag.DB(e);
    }
  } catch (e) {}
}
if (!utag_condload) {
  try {
    try {
      var utag_data = typeof utag_data != "undefined" ? utag_data : {};
      window.reportObjDev = {
        "uat.usbancorpassetmanagement.com": "usbankcorpassestmanagementdev",
        "www.usbancorpassetmanagement.com": "usbankcorpassestmanagementprod",
        "uat.firstamericanfunds.com": "usbankcorpassestmanagementdev",
        "www.firstamericanfunds.com": "usbankcorpassestmanagementprod",
        "www.usbank.com": "usbankcom",
        "emp.usbank.com": "usbankcom",
        "onboarding.usbank.com": "usbankcom",
        "onlinebanking.usbank.com": "usbankcom",
        "apply.usbank.com": "usbankcom",
        "digitalbanking.us.bank-dns.com": "usbankcom",
        dev: "usbankdev",
        prod: "usbankcom",
      };
      utag_data["adobe_report_suite"] = window.reportObjDev[
        window.location.hostname
      ]
        ? window.reportObjDev[window.location.hostname]
        : window.reportObjDev["dev"];
      utag_data["adobe_site_id"] = "usb";
    } catch (e) {
      utag.DB(e);
    }
  } catch (e) {}
}
if (typeof utag == "undefined" && !utag_condload) {
  var utag = {
    id: "usbank.digital-banking",
    o: {},
    sender: {},
    send: {},
    rpt: { ts: { a: new Date() } },
    dbi: [],
    db_log: [],
    loader: {
      q: [],
      lc: 0,
      f: {},
      p: 0,
      ol: 0,
      wq: [],
      lq: [],
      bq: {},
      bk: {},
      rf: 0,
      ri: 0,
      rp: 0,
      rq: [],
      ready_q: [],
      sendq: { pending: 0 },
      run_ready_q: function () {
        for (var i = 0; i < utag.loader.ready_q.length; i++) {
          utag.DB("READY_Q:" + i);
          try {
            utag.loader.ready_q[i]();
          } catch (e) {
            utag.DB(e);
          }
        }
      },
      lh: function (a, b, c) {
        a = "" + location.hostname;
        b = a.split(".");
        c = /\.co\.|\.com\.|\.org\.|\.edu\.|\.net\.|\.asn\.|\...\.jp$/.test(a)
          ? 3
          : 2;
        return b.splice(b.length - c, c).join(".");
      },
      WQ: function (a, b, c, d, g) {
        utag.DB("WQ:" + utag.loader.wq.length);
        try {
          if (utag.udoname && utag.udoname.indexOf(".") < 0) {
            utag.ut.merge(utag.data, window[utag.udoname], 0);
          }
          if (utag.cfg.load_rules_at_wait) {
            utag.handler.LR(utag.data);
          }
        } catch (e) {
          utag.DB(e);
        }
        d = 0;
        g = [];
        for (a = 0; a < utag.loader.wq.length; a++) {
          b = utag.loader.wq[a];
          b.load = utag.loader.cfg[b.id].load;
          if (b.load == 4) {
            this.f[b.id] = 0;
            utag.loader.LOAD(b.id);
          } else if (b.load > 0) {
            g.push(b);
            d++;
          } else {
            this.f[b.id] = 1;
          }
        }
        for (a = 0; a < g.length; a++) {
          utag.loader.AS(g[a]);
        }
        if (d == 0) {
          utag.loader.END();
        }
      },
      AS: function (a, b, c, d) {
        utag.send[a.id] = a;
        if (typeof a.src == "undefined") {
          a.src =
            utag.cfg.path +
            (typeof a.name != "undefined"
              ? a.name
              : "ut" + "ag." + a.id + ".js");
        }
        a.src +=
          (a.src.indexOf("?") > 0 ? "&" : "?") +
          "utv=" +
          (a.v ? utag.cfg.template + a.v : utag.cfg.v);
        utag.rpt["l_" + a.id] = a.src;
        b = document;
        this.f[a.id] = 0;
        if (a.load == 2) {
          utag.DB("Attach sync: " + a.src);
          a.uid = a.id;
          b.write(
            '<script id="utag_' + a.id + '" src="' + a.src + '"></scr' + "ipt>"
          );
          if (typeof a.cb != "undefined") a.cb();
        } else if (a.load == 1 || a.load == 3) {
          if (b.createElement) {
            c = "utag_usbank.digital-banking_" + a.id;
            if (!b.getElementById(c)) {
              d = { src: a.src, id: c, uid: a.id, loc: a.loc };
              if (a.load == 3) {
                d.type = "iframe";
              }
              if (typeof a.cb != "undefined") d.cb = a.cb;
              utag.ut.loader(d);
            }
          }
        }
      },
      GV: function (a, b, c) {
        b = {};
        for (c in a) {
          if (a.hasOwnProperty(c) && typeof a[c] != "function") b[c] = a[c];
        }
        return b;
      },
      OU: function (tid, tcat, a, b, c, d, f, g) {
        g = {};
        utag.loader.RDcp(g);
        try {
          if (typeof g["cp.OPTOUTMULTI"] != "undefined") {
            c = utag.loader.cfg;
            a = utag.ut.decode(g["cp.OPTOUTMULTI"]).split("|");
            for (d = 0; d < a.length; d++) {
              b = a[d].split(":");
              if (b[1] * 1 !== 0) {
                if (b[0].indexOf("c") == 0) {
                  for (f in utag.loader.GV(c)) {
                    if (c[f].tcat == b[0].substring(1)) c[f].load = 0;
                    if (c[f].tid == tid && c[f].tcat == b[0].substring(1))
                      return true;
                  }
                  if (tcat == b[0].substring(1)) return true;
                } else if (b[0] * 1 == 0) {
                  utag.cfg.nocookie = true;
                } else {
                  for (f in utag.loader.GV(c)) {
                    if (c[f].tid == b[0]) c[f].load = 0;
                  }
                  if (tid == b[0]) return true;
                }
              }
            }
          }
        } catch (e) {
          utag.DB(e);
        }
        return false;
      },
      RDdom: function (o) {
        var d = document || {},
          l = location || {};
        o["dom.referrer"] = d.referrer;
        o["dom.title"] = "" + d.title;
        o["dom.domain"] = "" + l.hostname;
        o["dom.query_string"] = ("" + l.search).substring(1);
        o["dom.hash"] = ("" + l.hash).substring(1);
        o["dom.url"] = "" + d.URL;
        o["dom.pathname"] = "" + l.pathname;
        o["dom.viewport_height"] =
          window.innerHeight ||
          (d.documentElement ? d.documentElement.clientHeight : 960);
        o["dom.viewport_width"] =
          window.innerWidth ||
          (d.documentElement ? d.documentElement.clientWidth : 960);
      },
      RDcp: function (o, b, c, d) {
        b = utag.loader.RC();
        for (d in b) {
          if (d.match(/utag_(.*)/)) {
            for (c in utag.loader.GV(b[d])) {
              o["cp.utag_" + RegExp.$1 + "_" + c] = b[d][c];
            }
          }
        }
        for (c in utag.loader.GV(utag.cl && !utag.cl["_all_"] ? utag.cl : b)) {
          if (c.indexOf("utag_") < 0 && typeof b[c] != "undefined")
            o["cp." + c] = b[c];
        }
      },
      RDqp: function (o, a, b, c) {
        a = location.search + (location.hash + "").replace("#", "&");
        if (utag.cfg.lowerqp) {
          a = a.toLowerCase();
        }
        if (a.length > 1) {
          b = a.substring(1).split("&");
          for (a = 0; a < b.length; a++) {
            c = b[a].split("=");
            if (c.length > 1) {
              o["qp." + c[0]] = utag.ut.decode(c[1]);
            }
          }
        }
      },
      RDmeta: function (o, a, b, h) {
        a = document.getElementsByTagName("meta");
        for (b = 0; b < a.length; b++) {
          try {
            h = a[b].name || a[b].getAttribute("property") || "";
          } catch (e) {
            h = "";
            utag.DB(e);
          }
          if (utag.cfg.lowermeta) {
            h = h.toLowerCase();
          }
          if (h != "") {
            o["meta." + h] = a[b].content;
          }
        }
      },
      RDva: function (o) {
        var readAttr = function (o, l) {
          var a = "",
            b;
          a = localStorage.getItem(l);
          if (!a || a == "{}") return;
          b = utag.ut.flatten({ va: JSON.parse(a) });
          utag.ut.merge(o, b, 1);
        };
        try {
          readAttr(o, "tealium_va");
          readAttr(o, "tealium_va_" + o["ut.account"] + "_" + o["ut.profile"]);
        } catch (e) {
          utag.DB(e);
        }
      },
      RDut: function (o, a) {
        var t = {};
        var d = new Date();
        var m = utag.ut.typeOf(d.toISOString) == "function";
        o["ut.domain"] = utag.cfg.domain;
        o["ut.version"] = utag.cfg.v;
        t["tealium_event"] = o["ut.event"] = a || "view";
        t["tealium_visitor_id"] = o["ut.visitor_id"] = o["cp.utag_main_v_id"];
        t["tealium_session_id"] = o["ut.session_id"] = o["cp.utag_main_ses_id"];
        t["tealium_session_number"] = o["cp.utag_main__sn"];
        t["tealium_session_event_number"] = o["cp.utag_main__se"];
        try {
          t["tealium_datasource"] = utag.cfg.datasource;
          t["tealium_account"] = o["ut.account"] = utag.cfg.utid.split("/")[0];
          t["tealium_profile"] = o["ut.profile"] = utag.cfg.utid.split("/")[1];
          t["tealium_environment"] = o["ut.env"] = utag.cfg.path.split("/")[6];
        } catch (e) {
          utag.DB(e);
        }
        t["tealium_random"] = Math.random().toFixed(16).substring(2);
        t["tealium_library_name"] = "ut" + "ag.js";
        t["tealium_library_version"] = (utag.cfg.template + "0").substring(2);
        t["tealium_timestamp_epoch"] = Math.floor(d.getTime() / 1000);
        t["tealium_timestamp_utc"] = m ? d.toISOString() : "";
        d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
        t["tealium_timestamp_local"] = m
          ? d.toISOString().replace("Z", "")
          : "";
        utag.ut.merge(o, t, 0);
      },
      RDses: function (o, a, c) {
        a = new Date().getTime();
        c = a + parseInt(utag.cfg.session_timeout) + "";
        if (!o["cp.utag_main_ses_id"]) {
          o["cp.utag_main_ses_id"] = a + "";
          o["cp.utag_main__ss"] = "1";
          o["cp.utag_main__se"] = "1";
          o["cp.utag_main__sn"] = 1 + parseInt(o["cp.utag_main__sn"] || 0) + "";
        } else {
          o["cp.utag_main__ss"] = "0";
          o["cp.utag_main__se"] = 1 + parseInt(o["cp.utag_main__se"] || 0) + "";
        }
        o["cp.utag_main__pn"] = o["cp.utag_main__pn"] || "1";
        o["cp.utag_main__st"] = c;
        utag.loader.SC("utag_main", {
          _sn: o["cp.utag_main__sn"] || 1,
          _se: o["cp.utag_main__se"],
          _ss: o["cp.utag_main__ss"],
          _st: c,
          ses_id: (o["cp.utag_main_ses_id"] || a) + ";exp-session",
          _pn: o["cp.utag_main__pn"] + ";exp-session",
        });
      },
      RDpv: function (o) {
        if (typeof utag.pagevars == "function") {
          utag.DB("Read page variables");
          utag.pagevars(o);
        }
      },
      RD: function (o, a) {
        utag.DB("utag.loader.RD");
        utag.DB(o);
        utag.loader.RDcp(o);
        if (!utag.loader.rd_flag) {
          utag.loader.rd_flag = 1;
          o["cp.utag_main_v_id"] =
            o["cp.utag_main_v_id"] || utag.ut.vi(new Date().getTime());
          o["cp.utag_main__pn"] = 1 + parseInt(o["cp.utag_main__pn"] || 0) + "";
          utag.loader.SC("utag_main", { v_id: o["cp.utag_main_v_id"] });
          utag.loader.RDses(o);
        }
        if (a && !utag.cfg.noview) utag.loader.RDses(o);
        utag.loader.RDqp(o);
        utag.loader.RDmeta(o);
        utag.loader.RDdom(o);
        utag.loader.RDut(o, a || "view");
        utag.loader.RDpv(o);
        utag.loader.RDva(o);
      },
      RC: function (
        a,
        x,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        v,
        ck,
        cv,
        r,
        s,
        t
      ) {
        o = {};
        b = "" + document.cookie != "" ? document.cookie.split("; ") : [];
        r = /^(.*?)=(.*)$/;
        s = /^(.*);exp-(.*)$/;
        t = new Date().getTime();
        for (c = 0; c < b.length; c++) {
          if (b[c].match(r)) {
            ck = RegExp.$1;
            cv = RegExp.$2;
          }
          e = utag.ut.decode(cv);
          if (typeof ck != "undefined") {
            if (ck.indexOf("ulog") == 0 || ck.indexOf("utag_") == 0) {
              e = cv.split("$");
              g = [];
              j = {};
              for (f = 0; f < e.length; f++) {
                try {
                  g = e[f].split(":");
                  if (g.length > 2) {
                    g[1] = g.slice(1).join(":");
                  }
                  v = "";
                  if (("" + g[1]).indexOf("~") == 0) {
                    h = g[1].substring(1).split("|");
                    for (i = 0; i < h.length; i++) h[i] = utag.ut.decode(h[i]);
                    v = h;
                  } else v = utag.ut.decode(g[1]);
                  j[g[0]] = v;
                } catch (er) {
                  utag.DB(er);
                }
              }
              o[ck] = {};
              for (f in utag.loader.GV(j)) {
                if (j[f] instanceof Array) {
                  n = [];
                  for (m = 0; m < j[f].length; m++) {
                    if (j[f][m].match(s)) {
                      k =
                        RegExp.$2 == "session"
                          ? typeof j._st != "undefined"
                            ? j._st
                            : t - 1
                          : parseInt(RegExp.$2);
                      if (k > t) n[m] = x == 0 ? j[f][m] : RegExp.$1;
                    }
                  }
                  j[f] = n.join("|");
                } else {
                  j[f] = "" + j[f];
                  if (j[f].match(s)) {
                    k =
                      RegExp.$2 == "session"
                        ? typeof j._st != "undefined"
                          ? j._st
                          : t - 1
                        : parseInt(RegExp.$2);
                    j[f] = k < t ? null : x == 0 ? j[f] : RegExp.$1;
                  }
                }
                if (j[f]) o[ck][f] = j[f];
              }
            } else if (utag.cl[ck] || utag.cl["_all_"]) {
              o[ck] = e;
            }
          }
        }
        return a ? (o[a] ? o[a] : {}) : o;
      },
      SC: function (a, b, c, d, e, f, g, h, i, j, k, x, v) {
        if (!a) return 0;
        if (a == "utag_main" && utag.cfg.nocookie) return 0;
        v = "";
        var date = new Date();
        var exp = new Date();
        exp.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
        x = exp.toGMTString();
        if (c && c == "da") {
          x = "Thu, 31 Dec 2009 00:00:00 GMT";
        } else if (a.indexOf("utag_") != 0 && a.indexOf("ulog") != 0) {
          if (typeof b != "object") {
            v = b;
          }
        } else {
          d = utag.loader.RC(a, 0);
          for (e in utag.loader.GV(b)) {
            f = "" + b[e];
            if (f.match(/^(.*);exp-(\d+)(\w)$/)) {
              g =
                date.getTime() +
                parseInt(RegExp.$2) * (RegExp.$3 == "h" ? 3600000 : 86400000);
              if (RegExp.$3 == "u") g = parseInt(RegExp.$2);
              f = RegExp.$1 + ";exp-" + g;
            }
            if (c == "i") {
              if (d[e] == null) d[e] = f;
            } else if (c == "d") delete d[e];
            else if (c == "a") d[e] = d[e] != null ? f - 0 + (d[e] - 0) : f;
            else if (c == "ap" || c == "au") {
              if (d[e] == null) d[e] = f;
              else {
                if (d[e].indexOf("|") > 0) {
                  d[e] = d[e].split("|");
                }
                g = d[e] instanceof Array ? d[e] : [d[e]];
                g.push(f);
                if (c == "au") {
                  h = {};
                  k = {};
                  for (i = 0; i < g.length; i++) {
                    if (g[i].match(/^(.*);exp-(.*)$/)) {
                      j = RegExp.$1;
                    }
                    if (typeof k[j] == "undefined") {
                      k[j] = 1;
                      h[g[i]] = 1;
                    }
                  }
                  g = [];
                  for (i in utag.loader.GV(h)) {
                    g.push(i);
                  }
                }
                d[e] = g;
              }
            } else d[e] = f;
          }
          h = new Array();
          for (g in utag.loader.GV(d)) {
            if (d[g] instanceof Array) {
              for (c = 0; c < d[g].length; c++) {
                d[g][c] = encodeURIComponent(d[g][c]);
              }
              h.push(g + ":~" + d[g].join("|"));
            } else
              h.push(
                (g + ":").replace(/[\,\$\;\?]/g, "") + encodeURIComponent(d[g])
              );
          }
          if (h.length == 0) {
            h.push("");
            x = "";
          }
          v = h.join("$");
        }
        document.cookie =
          a + "=" + v + ";path=/;domain=" + utag.cfg.domain + ";expires=" + x;
        return 1;
      },
      LOAD: function (a, b, c, d) {
        if (!utag.loader.cfg) {
          return;
        }
        if (this.ol == 0) {
          if (utag.loader.cfg[a].block && utag.loader.cfg[a].cbf) {
            this.f[a] = 1;
            delete utag.loader.bq[a];
          }
          for (b in utag.loader.GV(utag.loader.bq)) {
            if (utag.loader.cfg[a].load == 4 && utag.loader.cfg[a].wait == 0) {
              utag.loader.bk[a] = 1;
              utag.DB("blocked: " + a);
            }
            utag.DB("blocking: " + b);
            return;
          }
          utag.loader.INIT();
          return;
        }
        utag.DB("utag.loader.LOAD:" + a);
        if (this.f[a] == 0) {
          this.f[a] = 1;
          if (utag.cfg.noview != true) {
            if (utag.loader.cfg[a].send) {
              utag.DB("SENDING: " + a);
              try {
                if (utag.loader.sendq.pending > 0 && utag.loader.sendq[a]) {
                  utag.DB("utag.loader.LOAD:sendq: " + a);
                  while ((d = utag.loader.sendq[a].shift())) {
                    utag.DB(d);
                    utag.sender[a].send(d.event, utag.handler.C(d.data));
                    utag.loader.sendq.pending--;
                  }
                } else {
                  utag.sender[a].send("view", utag.handler.C(utag.data));
                }
                utag.rpt["s_" + a] = 0;
              } catch (e) {
                utag.DB(e);
                utag.rpt["s_" + a] = 1;
              }
            }
          }
          if (utag.loader.rf == 0) return;
          for (b in utag.loader.GV(this.f)) {
            if (this.f[b] == 0 || this.f[b] == 2) return;
          }
          utag.loader.END();
        }
      },
      EV: function (a, b, c, d) {
        if (b == "ready") {
          if (!utag.data) {
            try {
              utag.cl = { _all_: 1 };
              utag.loader.initdata();
              utag.loader.RD(utag.data);
            } catch (e) {
              utag.DB(e);
            }
          }
          if (
            document.attachEvent || utag.cfg.dom_complete
              ? document.readyState === "complete"
              : document.readyState !== "loading"
          )
            setTimeout(c, 1);
          else {
            utag.loader.ready_q.push(c);
            var RH;
            if (utag.loader.ready_q.length <= 1) {
              if (document.addEventListener) {
                RH = function () {
                  document.removeEventListener("DOMContentLoaded", RH, false);
                  utag.loader.run_ready_q();
                };
                if (!utag.cfg.dom_complete)
                  document.addEventListener("DOMContentLoaded", RH, false);
                window.addEventListener("load", utag.loader.run_ready_q, false);
              } else if (document.attachEvent) {
                RH = function () {
                  if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", RH);
                    utag.loader.run_ready_q();
                  }
                };
                document.attachEvent("onreadystatechange", RH);
                window.attachEvent("onload", utag.loader.run_ready_q);
              }
            }
          }
        } else {
          if (a.addEventListener) {
            a.addEventListener(b, c, false);
          } else if (a.attachEvent) {
            a.attachEvent((d == 1 ? "" : "on") + b, c);
          }
        }
      },
      END: function (b, c, d, e, v, w) {
        if (this.ended) {
          return;
        }
        this.ended = 1;
        utag.DB("loader.END");
        b = utag.data;
        if (utag.handler.base && utag.handler.base != "*") {
          e = utag.handler.base.split(",");
          for (d = 0; d < e.length; d++) {
            if (typeof b[e[d]] != "undefined") utag.handler.df[e[d]] = b[e[d]];
          }
        } else if (utag.handler.base == "*") {
          utag.ut.merge(utag.handler.df, b, 1);
        }
        utag.rpt["r_0"] = "t";
        for (var r in utag.loader.GV(utag.cond)) {
          utag.rpt["r_" + r] = utag.cond[r] ? "t" : "f";
        }
        utag.rpt.ts["s"] = new Date();
        v = utag.cfg.path;
        w = v.indexOf(".tiqcdn.");
        if (w > 0 && b["cp.utag_main__ss"] == 1 && !utag.cfg.no_session_count)
          utag.ut.loader({
            src:
              v.substring(0, v.indexOf("/ut" + "ag/") + 6) +
              "tiqapp/ut" +
              "ag.v.js?a=" +
              utag.cfg.utid +
              (utag.cfg.nocookie
                ? "&nocookie=1"
                : "&cb=" + new Date().getTime()),
            id: "tiqapp",
          });
        if (utag.cfg.noview != true) utag.handler.RE("view", b, "end");
        utag.handler.INIT();
      },
    },
    DB: function (a, b) {
      if (utag.cfg.utagdb === false) {
        return;
      } else if (typeof utag.cfg.utagdb == "undefined") {
        b = document.cookie + "";
        utag.cfg.utagdb = b.indexOf("utagdb=true") >= 0 ? true : false;
      }
      if (utag.cfg.utagdb === true) {
        var t;
        if (utag.ut.typeOf(a) == "object") {
          t = utag.handler.C(a);
        } else {
          t = a;
        }
        utag.db_log.push(t);
        try {
          if (!utag.cfg.noconsole) console.log(t);
        } catch (e) {}
      }
    },
    RP: function (a, b, c) {
      if (
        typeof a != "undefined" &&
        typeof a.src != "undefined" &&
        a.src != ""
      ) {
        b = [];
        for (c in utag.loader.GV(a)) {
          if (c != "src") b.push(c + "=" + escape(a[c]));
        }
        this.dbi.push(
          (new Image().src =
            a.src +
            "?utv=" +
            utag.cfg.v +
            "&utid=" +
            utag.cfg.utid +
            "&" +
            b.join("&"))
        );
      }
    },
    view: function (a, c, d) {
      return this.track({
        event: "view",
        data: a || {},
        cfg: { cb: c, uids: d },
      });
    },
    link: function (a, c, d) {
      return this.track({
        event: "link",
        data: a || {},
        cfg: { cb: c, uids: d },
      });
    },
    track: function (a, b, c, d, e) {
      a = a || {};
      if (typeof a == "string") {
        a = { event: a, data: b || {}, cfg: { cb: c, uids: d } };
      }
      for (e in utag.loader.GV(utag.o)) {
        utag.o[e].handler.trigger(
          a.event || "view",
          a.data || a,
          a.cfg || { cb: b, uids: c }
        );
      }
      a.cfg = a.cfg || { cb: b };
      if (typeof a.cfg.cb == "function") a.cfg.cb();
      return true;
    },
    handler: {
      base: "",
      df: {},
      o: {},
      send: {},
      iflag: 0,
      INIT: function (a, b, c) {
        utag.DB("utag.handler.INIT");
        if (utag.initcatch) {
          utag.initcatch = 0;
          return;
        }
        this.iflag = 1;
        a = utag.loader.q.length;
        if (a > 0) {
          utag.DB("Loader queue");
          for (b = 0; b < a; b++) {
            c = utag.loader.q[b];
            utag.handler.trigger(c.a, c.b, c.c);
          }
        }
      },
      test: function () {
        return 1;
      },
      LR: function (b) {
        utag.DB("Load Rules");
        for (var d in utag.loader.GV(utag.cond)) {
          utag.cond[d] = false;
        }
        utag.DB(b);
        utag.loader.loadrules(b);
        utag.DB(utag.cond);
        utag.loader.initcfg();
        utag.loader.OU();
        for (var r in utag.loader.GV(utag.cond)) {
          utag.rpt["r_" + r] = utag.cond[r] ? "t" : "f";
        }
      },
      RE: function (a, b, c, d, e, f, g) {
        if (c != "alr" && !this.cfg_extend) {
          return 0;
        }
        utag.DB("RE: " + c);
        if (c == "alr") utag.DB("All Tags EXTENSIONS");
        utag.DB(b);
        if (typeof this.extend != "undefined") {
          g = 0;
          for (d = 0; d < this.extend.length; d++) {
            try {
              e = 0;
              if (typeof this.cfg_extend != "undefined") {
                f = this.cfg_extend[d];
                if (typeof f.count == "undefined") f.count = 0;
                if (f[a] == 0 || (f.once == 1 && f.count > 0) || f[c] == 0) {
                  e = 1;
                } else {
                  if (f[c] == 1) {
                    g = 1;
                  }
                  f.count++;
                }
              }
              if (e != 1) {
                this.extend[d](a, b);
                utag.rpt["ex_" + d] = 0;
              }
            } catch (er) {
              utag.DB(er);
              utag.rpt["ex_" + d] = 1;
              utag.ut.error({
                e: er.message,
                s: utag.cfg.path + "utag.js",
                l: d,
                t: "ge",
              });
            }
          }
          utag.DB(b);
          return g;
        }
      },
      trigger: function (a, b, c, d, e, f) {
        utag.DB("trigger:" + a + (c && c.uids ? ":" + c.uids.join(",") : ""));
        b = b || {};
        utag.DB(b);
        if (!this.iflag) {
          utag.DB("trigger:called before tags loaded");
          for (d in utag.loader.f) {
            if (!(utag.loader.f[d] === 1))
              utag.DB("Tag " + d + " did not LOAD");
          }
          utag.loader.q.push({ a: a, b: utag.handler.C(b), c: c });
          return;
        }
        utag.ut.merge(b, this.df, 0);
        utag.loader.RD(b, a);
        utag.cfg.noview = false;
        function sendTag(a, b, d) {
          try {
            if (typeof utag.sender[d] != "undefined") {
              utag.DB("SENDING: " + d);
              utag.sender[d].send(a, utag.handler.C(b));
              utag.rpt["s_" + d] = 0;
            } else if (utag.loader.cfg[d].load != 2) {
              utag.loader.sendq[d] = utag.loader.sendq[d] || [];
              utag.loader.sendq[d].push({ event: a, data: utag.handler.C(b) });
              utag.loader.sendq.pending++;
              utag.loader.AS({ id: d, load: 1 });
            }
          } catch (e) {
            utag.DB(e);
          }
        }
        if (c && c.uids) {
          this.RE(a, b, "alr");
          for (f = 0; f < c.uids.length; f++) {
            d = c.uids[f];
            if (!utag.loader.OU(utag.loader.cfg[d].tid)) {
              sendTag(a, b, d);
            }
          }
        } else if (utag.cfg.load_rules_ajax) {
          this.RE(a, b, "blr");
          this.LR(b);
          this.RE(a, b, "alr");
          for (f = 0; f < utag.loader.cfgsort.length; f++) {
            d = utag.loader.cfgsort[f];
            if (utag.loader.cfg[d].load && utag.loader.cfg[d].send) {
              sendTag(a, b, d);
            }
          }
        } else {
          this.RE(a, b, "alr");
          for (d in utag.loader.GV(utag.sender)) {
            sendTag(a, b, d);
          }
        }
        this.RE(a, b, "end");
      },
      C: function (a, b, c) {
        b = {};
        for (c in utag.loader.GV(a)) {
          if (a[c] instanceof Array) {
            b[c] = a[c].slice(0);
          } else {
            b[c] = a[c];
          }
        }
        return b;
      },
    },
    ut: {
      pad: function (a, b, c, d) {
        a = "" + (a - 0).toString(16);
        d = "";
        if (b > a.length) {
          for (c = 0; c < b - a.length; c++) {
            d += "0";
          }
        }
        return "" + d + a;
      },
      vi: function (t, a, b) {
        if (!utag.v_id) {
          a = this.pad(t, 12);
          b = "" + Math.random();
          a += this.pad(b.substring(2, b.length), 16);
          try {
            a += this.pad(
              navigator.plugins.length ? navigator.plugins.length : 0,
              2
            );
            a += this.pad(navigator.userAgent.length, 3);
            a += this.pad(document.URL.length, 4);
            a += this.pad(navigator.appVersion.length, 3);
            a += this.pad(
              screen.width +
                screen.height +
                parseInt(
                  screen.colorDepth ? screen.colorDepth : screen.pixelDepth
                ),
              5
            );
          } catch (e) {
            utag.DB(e);
            a += "12345";
          }
          utag.v_id = a;
        }
        return utag.v_id;
      },
      hasOwn: function (o, a) {
        return o != null && Object.prototype.hasOwnProperty.call(o, a);
      },
      isEmptyObject: function (o, a) {
        for (a in o) {
          if (utag.ut.hasOwn(o, a)) return false;
        }
        return true;
      },
      isEmpty: function (o) {
        var t = utag.ut.typeOf(o);
        if (t == "number") {
          return isNaN(o);
        } else if (t == "boolean") {
          return false;
        } else if (t == "string") {
          return o.length === 0;
        } else return utag.ut.isEmptyObject(o);
      },
      typeOf: function (e) {
        return {}.toString
          .call(e)
          .match(/\s([a-zA-Z]+)/)[1]
          .toLowerCase();
      },
      flatten: function (o) {
        var a = {};
        function r(c, p) {
          if (Object(c) !== c || c instanceof Array) {
            a[p] = c;
          } else {
            if (utag.ut.isEmptyObject(c)) {
            } else {
              for (var d in c) {
                r(c[d], p ? p + "." + d : d);
              }
            }
          }
        }
        r(o, "");
        return a;
      },
      merge: function (a, b, c, d) {
        if (c) {
          for (d in utag.loader.GV(b)) {
            a[d] = b[d];
          }
        } else {
          for (d in utag.loader.GV(b)) {
            if (typeof a[d] == "undefined") a[d] = b[d];
          }
        }
      },
      decode: function (a, b) {
        b = "";
        try {
          b = decodeURIComponent(a);
        } catch (e) {
          utag.DB(e);
        }
        if (b == "") {
          b = unescape(a);
        }
        return b;
      },
      encode: function (a, b) {
        b = "";
        try {
          b = encodeURIComponent(a);
        } catch (e) {
          utag.DB(e);
        }
        if (b == "") {
          b = escape(a);
        }
        return b;
      },
      error: function (a, b, c) {
        if (typeof utag_err != "undefined") {
          utag_err.push(a);
        }
      },
      loader: function (o, a, b, c, l, m) {
        utag.DB(o);
        a = document;
        if (o.type == "iframe") {
          m = a.getElementById(o.id);
          if (m && m.tagName == "IFRAME") {
            m.parentNode.removeChild(m);
          }
          b = a.createElement("iframe");
          o.attrs = o.attrs || {};
          utag.ut.merge(
            o.attrs,
            { height: "1", width: "1", style: "display:none" },
            0
          );
        } else if (o.type == "img") {
          utag.DB("Attach img: " + o.src);
          b = new Image();
        } else {
          b = a.createElement("script");
          b.language = "javascript";
          b.type = "text/javascript";
          b.async = 1;
          b.charset = "utf-8";
        }
        if (o.id) {
          b.id = o.id;
        }
        for (l in utag.loader.GV(o.attrs)) {
          b.setAttribute(l, o.attrs[l]);
        }
        b.setAttribute("src", o.src);
        if (typeof o.cb == "function") {
          if (b.addEventListener) {
            b.addEventListener(
              "load",
              function () {
                o.cb();
              },
              false
            );
          } else {
            b.onreadystatechange = function () {
              if (
                this.readyState == "complete" ||
                this.readyState == "loaded"
              ) {
                this.onreadystatechange = null;
                o.cb();
              }
            };
          }
        }
        if (typeof o.error == "function") {
          utag.loader.EV(b, "error", o.error);
        }
        if (o.type != "img") {
          l = o.loc || "head";
          c = a.getElementsByTagName(l)[0];
          if (c) {
            utag.DB("Attach to " + l + ": " + o.src);
            if (l == "script") {
              c.parentNode.insertBefore(b, c);
            } else {
              c.appendChild(b);
            }
          }
        }
      },
    },
  };
  utag.o["usbank.digital-banking"] = utag;
  utag.cfg = {
    template: "ut4.46.",
    load_rules_ajax: true,
    load_rules_at_wait: false,
    lowerqp: false,
    noconsole: false,
    session_timeout: 1800000,
    readywait: 0,
    noload: 0,
    domain: utag.loader.lh(),
    datasource: "##UTDATASOURCE##".replace("##" + "UTDATASOURCE##", ""),
    path: "//tags.tiqcdn.com/utag/usbank/digital-banking/dev/",
    utid: "usbank/digital-banking/202004272140",
  };
  utag.cfg.v = utag.cfg.template + "202004272140";
  utag.cond = { 11: 0, 23: 0 };
  utag.loader.initdata = function () {
    try {
      utag.data = typeof utag_data != "undefined" ? utag_data : {};
      utag.udoname = "utag_data";
    } catch (e) {
      utag.data = {};
      utag.DB("idf:" + e);
    }
  };
  utag.loader.loadrules = function (_pd, _pc) {
    var d = _pd || utag.data;
    var c = _pc || utag.cond;
    for (var l in utag.loader.GV(c)) {
      switch (l) {
        case "11":
          try {
            c[11] |=
              typeof d["dom.domain"] != "undefined" &&
              typeof d["dom.domain"] == "undefined";
          } catch (e) {
            utag.DB(e);
          }
          break;
        case "23":
          try {
            c[23] |=
              d["dom.domain"].toString().indexOf("investingoptions") > -1;
          } catch (e) {
            utag.DB(e);
          }
          break;
      }
    }
  };
  utag.pre = function () {
    utag.loader.initdata();
    try {
      utag.loader.RD(utag.data);
    } catch (e) {
      utag.DB(e);
    }
    utag.loader.loadrules();
  };
  utag.loader.GET = function () {
    utag.cl = { _all_: 1 };
    utag.pre();
    utag.handler.extend = [
      function (a, b) {
        try {
          utag.runonce = utag.runonce || {};
          utag.runonce.ext = utag.runonce.ext || {};
          if (typeof utag.runonce.ext[21] == "undefined") {
            utag.runonce.ext[21] = 1;
            if (1) {
              setTimeout(function () {
                if (
                  typeof s != "undefined" &&
                  typeof utag.data["insight_uid"] != "undefined"
                ) {
                  utag.view({}, null, [utag.data["insight_uid"]]);
                }
              }, 5001);
            }
          }
        } catch (e) {
          utag.DB(e);
        }
      },
      function (a, b) {
        try {
          if (1) {
            try {
              b["product_id"] = window.reportingData.products[0].productId;
            } catch (e) {}
            try {
              b["product_name"] = window.reportingData.products[0].productName
                .replace(/<\/?sup>/g, "")
                .replace(/&/g, " ")
                .replace(/reg;/g, "")
                .replace("  ", " ");
            } catch (e) {}
            try {
              b["mobileDevice"] = /Mobi|Tablet|Android/.test(
                navigator.userAgent
              )
                ? true
                : false;
            } catch (e) {}
            try {
              b["product_family"] = reportingData.products[0].productFamily
                ? reportingData.products[0].productFamily
                : "";
            } catch (e) {}
            try {
              b["product_line"] = window.reportingData.products[0].productLine
                ? window.reportingData.products[0].productLine
                : "";
            } catch (e) {}
            try {
              b["application_id"] =
                window.reportingData.appId ||
                window.reportingData.products[0].appId
                  ? window.reportingData.appId ||
                    window.reportingData.products[0].appId
                  : "";
            } catch (e) {}
            try {
              b["application_state"] =
                window.reportingData.appState ||
                window.reportingData.products[0].appState
                  ? window.reportingData.appState ||
                    window.reportingData.products[0].appState
                  : "";
            } catch (e) {}
            try {
              b["promo_code"] = window.reportingData.promoCode
                ? window.reportingData.promoCode
                : "";
            } catch (e) {}
            try {
              b["apply_platform"] = window.reportingData.applyPlatform
                ? window.reportingData.applyPlatform.toLowerCase()
                : "";
            } catch (e) {}
            try {
              b["product_count"] = window.reportingData.products.length
                ? window.reportingData.products.length
                : "";
            } catch (e) {}
            try {
              b["page_name"] = window.reportingData.currentPage
                ? window.reportingData.currentPage.toLowerCase()
                : "";
            } catch (e) {}
            try {
              b["results_decision"] = window.reportingData.resultsData
                ? window.reportingData.resultsData.decisionDesc
                : reportingData.products[0].productDecision.decisionDesc
                ? reportingData.products[0].productDecision.decisionDesc
                : "";
            } catch (e) {}
            try {
              b["location_code"] =
                window.reportingData.products[0].locationCode;
            } catch (e) {}
            try {
              b["offer_code"] = window.reportingData.products[0].offerId;
            } catch (e) {}
            try {
              b["balance_transfer"] = window.reportingData.balanceTransfer;
            } catch (e) {}
            try {
              b["direct_mail_invitation_to_apply"] =
                window.reportingData.products[0].directMailInvitationToApply;
            } catch (e) {}
            try {
              b["direct_mail_prequalified_offer"] =
                window.reportingData.products[0].directMailPrequalifiedOffer;
            } catch (e) {}
            try {
              b["direct_mail_offer_confirmation_code"] =
                window.reportingData.products[0].directMailOfferConfirmationCode;
            } catch (e) {}
            try {
              b["acaps_reference_id"] = window.reportingData.resultsData
                ? window.reportingData.resultsData.acapsReferenceId
                : window.reportingData.products[0].productDecision
                    .acapsReferenceId
                ? window.reportingData.products[0].productDecision
                    .acapsReferenceId
                : "";
            } catch (e) {}
            try {
              b["device_name"] = window.Utagger.getDeviceName();
            } catch (e) {}
          }
        } catch (e) {
          utag.DB(e);
        }
      },
      function (a, b) {
        try {
          utag.runonce = utag.runonce || {};
          utag.runonce.ext = utag.runonce.ext || {};
          if (typeof utag.runonce.ext[31] == "undefined") {
            utag.runonce.ext[31] = 1;
            if (1) {
              function deleteCookie(name) {
                document.cookie =
                  name +
                  "=; Path=/; domain=.usbank.com; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              }
              deleteCookie("_4c_mc_");
              deleteCookie("_4c_");
            }
          }
        } catch (e) {
          utag.DB(e);
        }
      },
    ];
    utag.handler.cfg_extend = [
      { bwq: 0, alr: 0, blr: 0, end: 1, id: "21" },
      { end: 0, blr: 0, id: "23", alr: 1, bwq: 0 },
      { alr: 1, bwq: 0, id: "31", end: 0, blr: 0 },
    ];
    utag.loader.initcfg = function () {
      utag.loader.cfg = {
        "21": { load: 4, send: 1, v: 202003252329, wait: 0, tid: 1191 },
        "18": { load: 1, send: 1, v: 202004272115, wait: 1, tid: 1206 },
        "16": { load: 1, send: 1, v: 202004272140, wait: 1, tid: 19063 },
        "19": {
          load: utag.cond[11],
          send: 1,
          v: 202004242015,
          wait: 1,
          tid: 20067,
        },
        "20": { load: 1, send: 1, v: 202004242015, wait: 1, tid: 17003 },
        "33": {
          load: utag.cond[23],
          send: 1,
          v: 202004242015,
          wait: 1,
          tid: 20010,
        },
      };
      utag.loader.cfgsort = ["21", "18", "16", "19", "20", "33"];
    };
    utag.loader.initcfg();
  };
  if (typeof utag_cfg_ovrd != "undefined") {
    for (utag._i in utag.loader.GV(utag_cfg_ovrd))
      utag.cfg[utag._i] = utag_cfg_ovrd[utag._i];
  }
  utag.loader.PINIT = function (a, b, c) {
    utag.DB("Pre-INIT");
    if (utag.cfg.noload) {
      return;
    }
    try {
      this.GET();
      if (utag.handler.RE("view", utag.data, "blr")) {
        utag.handler.LR(utag.data);
      }
    } catch (e) {
      utag.DB(e);
    }
    a = this.cfg;
    c = 0;
    for (b in this.GV(a)) {
      if (
        a[b].block == 1 ||
        (a[b].load > 0 && typeof a[b].src != "undefined" && a[b].src != "")
      ) {
        a[b].block = 1;
        c = 1;
        this.bq[b] = 1;
      }
    }
    if (c == 1) {
      for (b in this.GV(a)) {
        if (a[b].block) {
          a[b].id = b;
          if (a[b].load == 4) a[b].load = 1;
          a[b].cb = function () {
            var d = this.uid;
            utag.loader.cfg[d].cbf = 1;
            utag.loader.LOAD(d);
          };
          this.AS(a[b]);
        }
      }
    }
    if (c == 0) this.INIT();
  };
  utag.loader.INIT = function (a, b, c, d, e) {
    utag.DB("utag.loader.INIT");
    if (this.ol == 1) return -1;
    else this.ol = 1;
    if (utag.cfg.noview != true) utag.handler.RE("view", utag.data, "alr");
    utag.rpt.ts["i"] = new Date();
    d = this.cfgsort;
    for (a = 0; a < d.length; a++) {
      e = d[a];
      b = this.cfg[e];
      b.id = e;
      if (b.block != 1) {
        if (
          utag.loader.bk[b.id] ||
          ((utag.cfg.readywait || utag.cfg.noview) && b.load == 4)
        ) {
          this.f[b.id] = 0;
          utag.loader.LOAD(b.id);
        } else if (b.wait == 1 && utag.loader.rf == 0) {
          utag.DB("utag.loader.INIT: waiting " + b.id);
          this.wq.push(b);
          this.f[b.id] = 2;
        } else if (b.load > 0) {
          utag.DB("utag.loader.INIT: loading " + b.id);
          this.lq.push(b);
          this.AS(b);
        }
      }
    }
    if (this.wq.length > 0)
      utag.loader.EV("", "ready", function (a) {
        if (utag.loader.rf == 0) {
          utag.DB("READY:utag.loader.wq");
          utag.loader.rf = 1;
          utag.loader.WQ();
        }
      });
    else if (this.lq.length > 0) utag.loader.rf = 1;
    else if (this.lq.length == 0) utag.loader.END();
    return 1;
  };
  utag.loader.EV("", "ready", function (a) {
    if (utag.loader.efr != 1) {
      utag.loader.efr = 1;
      try {
        try {
          if (1) {
            (function () {
              var qtm = document.createElement("script");
              qtm.type = "text/javascript";
              qtm.async = 1;
              var srcVal =
                document.location.hostname.indexOf("uat") == -1
                  ? "usbankit.js"
                  : "usbankuat.js";
              qtm.src =
                "https://cdn.quantummetric.com/qscripts/quantum-" + srcVal;
              var d = document.getElementsByTagName("script")[0];
              !window.QuantumMetricAPI && d.parentNode.insertBefore(qtm, d);
            })();
          }
        } catch (e) {
          utag.DB(e);
        }
      } catch (e) {
        utag.DB(e);
      }
      try {
        try {
          if (
            utag.data["dom.domain"].toString().indexOf("apply.usbank.com") >
              -1 ||
            utag.data["dom.domain"]
              .toString()
              .indexOf("onboarding.usbank.com") > -1
          ) {
            var fieldValue = visitor.cookieRead("lastField");
            if (!fieldValue) {
              visitor.cookieWrite("lastField", "no field clicked");
            }
            $(document).on("focus", "input,select", function (event) {
              try {
                var fieldName = $(this).closest("ng-form").attr("name");
                fieldName = fieldName
                  ? fieldName + "." + event.target.name
                  : event.target.name
                  ? event.target.name
                  : "";
                visitor.cookieWrite("lastField", fieldName);
              } catch (e) {
                console.log("error setting last clicked field");
              }
            });
            $(document).on("click", "md-radio-button", function (event) {
              try {
                var fieldName = $(this).closest("md-radio-group").attr("name");
                fieldName = fieldName ? "form." + fieldName : "";
                visitor.cookieWrite("lastField", fieldName);
              } catch (e) {
                console.log("error setting last clicked field");
              }
            });
            window.onbeforeunload = function () {
              if (!Utagger.loginbuttonClick) {
                visitor.cookieWrite("lf", visitor.cookieRead("lastField"));
                window.s.eVar20 = visitor.cookieRead("lastField");
                window.s.linkTrackVars =
                  "eVar20,eVar32,eVar35,eVar68,products,prop2,prop40";
                window.s.tl(window, "o", "Session Abandoned");
              }
              setTimeout(function () {
                console.log("waiting for SiteCat traffic");
              }, 500);
            };
            setTimeout(function () {
              if (
                window.reportingData &&
                window.reportingData.currentPage &&
                window.reportingData.currentPage.toLowerCase() == "timeout"
              ) {
                visitor.cookieWrite("lf", visitor.cookieRead("lastField"));
                window.s.eVar20 = visitor.cookieRead("lastField");
                window.s.linkTrackVars = "eVar20,eVar32,eVar35,eVar68,products";
                window.s.tl(window, "o", "Session Expired");
              }
            }, 1000);
          }
        } catch (e) {
          utag.DB(e);
        }
      } catch (e) {
        utag.DB(e);
      }
      try {
        try {
          if (1) {
            var trackObj = {};
            window.publisherFW.addListenerMap("SiteCatalyst", {
              pageView: {
                isEnabled: true,
                track: function (d) {
                  trackObj = {
                    pageName: d.currentPage ? d.currentPage : "",
                    prop1: d.siteSection ? d.siteSection : "",
                    prop2: d.subSiteSection ? d.subSiteSection : "",
                    prop13: d.transactionError ? d.transactionError : "",
                    prop40: d.sitePlatform ? d.sitePlatform : "",
                    prop28: d.channel ? d.channel : "",
                    prop67: d.deviceType ? d.deviceType : "",
                    prop38: d.stopPaymentType ? d.stopPaymentType : "",
                    eVar109: d.stopPaymentType ? d.stopPaymentType : "",
                    eVar35: "D=pageName",
                    eVar40: "D=c2",
                    events:
                      d.transactionStatus == "stop payment start"
                        ? "event236"
                        : d.transactionStatus == "stop payment success"
                        ? "event237"
                        : "",
                  };
                  if (window.s && s.account) {
                  }
                  window.publisherFW.scFM.pageViewCall(trackObj);
                },
              },
              onClick: {
                isEnabled: true,
                track: function (d) {
                  trackObj = {
                    prop1: d.siteSection ? d.siteSection : "",
                    prop2: d.subSiteSection ? d.subSiteSection : "",
                    prop28: d.channel ? d.channel : "",
                    prop67: d.deviceType ? d.deviceType : "",
                    prop40: d.sitePlatform ? d.sitePlatform : "",
                    pageName: d.currentPage ? d.currentPage : "",
                    prop53: d.onClickEvent ? d.onClickEvent : "",
                    link_name: d.onClickEvent ? d.onClickEvent : "",
                    events:
                      d.transactionStatus ==
                      "general banking we will call you link"
                        ? "event333"
                        : d.transactionStatus ==
                          "general banking submit phone number link"
                        ? "event334"
                        : d.transactionStatus ==
                          "mortgage we will call you link"
                        ? "event335"
                        : d.transactionStatus ==
                          "mortgage submit phone number link"
                        ? "event336"
                        : d.transactionStatus ==
                          "card member we will call you link"
                        ? "event337"
                        : d.transactionStatus ==
                          "cardmember submit phone number link"
                        ? "event338"
                        : "",
                  };
                  window.publisherFW.scFM.trackCall(trackObj, trackObj.prop53);
                },
              },
            });
          }
        } catch (e) {
          utag.DB(e);
        }
      } catch (e) {
        utag.DB(e);
      }
    }
  });
  if (utag.cfg.readywait || utag.cfg.waittimer) {
    utag.loader.EV("", "ready", function (a) {
      if (utag.loader.rf == 0) {
        utag.loader.rf = 1;
        utag.cfg.readywait = 1;
        utag.DB("READY:utag.cfg.readywait");
        setTimeout(function () {
          utag.loader.PINIT();
        }, utag.cfg.waittimer || 1);
      }
    });
  } else {
    utag.loader.PINIT();
  }
}
//tealium universal tag - utag.21 ut4.0.202004272140, Copyright 2020 Tealium.com Inc. All Rights Reserved.
var e = (function () {
  "use strict";
  function e(t) {
    return (e =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(t);
  }
  function t(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function n() {
    return {
      callbacks: {},
      add: function (e, t) {
        this.callbacks[e] = this.callbacks[e] || [];
        var n = this.callbacks[e].push(t) - 1,
          i = this;
        return function () {
          i.callbacks[e].splice(n, 1);
        };
      },
      execute: function (e, t) {
        if (this.callbacks[e]) {
          (t = void 0 === t ? [] : t), (t = t instanceof Array ? t : [t]);
          try {
            for (; this.callbacks[e].length; ) {
              var n = this.callbacks[e].shift();
              "function" == typeof n
                ? n.apply(null, t)
                : n instanceof Array && n[1].apply(n[0], t);
            }
            delete this.callbacks[e];
          } catch (e) {}
        }
      },
      executeAll: function (e, t) {
        (t || (e && !j.isObjectEmpty(e))) &&
          Object.keys(this.callbacks).forEach(function (t) {
            var n = void 0 !== e[t] ? e[t] : "";
            this.execute(t, n);
          }, this);
      },
      hasCallbacks: function () {
        return Boolean(Object.keys(this.callbacks).length);
      },
    };
  }
  function i(e, t, n) {
    var i = null == e ? void 0 : e[t];
    return void 0 === i ? n : i;
  }
  function r(e) {
    for (var t = /^\d+$/, n = 0, i = e.length; n < i; n++)
      if (!t.test(e[n])) return !1;
    return !0;
  }
  function a(e, t) {
    for (; e.length < t.length; ) e.push("0");
    for (; t.length < e.length; ) t.push("0");
  }
  function o(e, t) {
    for (var n = 0; n < e.length; n++) {
      var i = parseInt(e[n], 10),
        r = parseInt(t[n], 10);
      if (i > r) return 1;
      if (r > i) return -1;
    }
    return 0;
  }
  function s(e, t) {
    if (e === t) return 0;
    var n = e.toString().split("."),
      i = t.toString().split(".");
    return r(n.concat(i)) ? (a(n, i), o(n, i)) : NaN;
  }
  function l(e) {
    return e === Object(e) && 0 === Object.keys(e).length;
  }
  function c(e) {
    return "function" == typeof e || (e instanceof Array && e.length);
  }
  function u() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
      t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : function () {
              return !0;
            };
    (this.log = _e("log", e, t)),
      (this.warn = _e("warn", e, t)),
      (this.error = _e("error", e, t));
  }
  function d() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      t = e.isEnabled,
      n = e.cookieName,
      i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      r = i.cookies;
    return t && n && r
      ? {
          remove: function () {
            r.remove(n);
          },
          get: function () {
            var e = r.get(n),
              t = {};
            try {
              t = JSON.parse(e);
            } catch (e) {
              t = {};
            }
            return t;
          },
          set: function (e, t) {
            (t = t || {}),
              r.set(n, JSON.stringify(e), {
                domain: t.optInCookieDomain || "",
                cookieLifetime: t.optInStorageExpiry || 3419e4,
                expires: !0,
              });
          },
        }
      : { get: Le, set: Le, remove: Le };
  }
  function f(e) {
    (this.name = this.constructor.name),
      (this.message = e),
      "function" == typeof Error.captureStackTrace
        ? Error.captureStackTrace(this, this.constructor)
        : (this.stack = new Error(e).stack);
  }
  function p() {
    function e(e, t) {
      var n = Se(e);
      return n.length
        ? n.every(function (e) {
            return !!t[e];
          })
        : De(t);
    }
    function t() {
      M(b),
        O(ce.COMPLETE),
        _(h.status, h.permissions),
        m.set(h.permissions, { optInCookieDomain: l, optInStorageExpiry: c }),
        C.execute(xe);
    }
    function n(e) {
      return function (n, i) {
        if (!Ae(n))
          throw new Error(
            "[OptIn] Invalid category(-ies). Please use the `OptIn.Categories` enum."
          );
        return O(ce.CHANGED), Object.assign(b, ye(Se(n), e)), i || t(), h;
      };
    }
    var i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      r = i.doesOptInApply,
      a = i.previousPermissions,
      o = i.preOptInApprovals,
      s = i.isOptInStorageEnabled,
      l = i.optInCookieDomain,
      c = i.optInStorageExpiry,
      u = i.isIabContext,
      f = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      p = f.cookies,
      g = Pe(a);
    Re(g, "Invalid `previousPermissions`!"),
      Re(o, "Invalid `preOptInApprovals`!");
    var m = d({ isEnabled: !!s, cookieName: "adobeujs-optin" }, { cookies: p }),
      h = this,
      _ = le(h),
      C = ge(),
      I = Me(g),
      v = Me(o),
      S = m.get(),
      D = {},
      A = (function (e, t) {
        return ke(e) || (t && ke(t)) ? ce.COMPLETE : ce.PENDING;
      })(I, S),
      y = (function (e, t, n) {
        var i = ye(pe, !r);
        return r ? Object.assign({}, i, e, t, n) : i;
      })(v, I, S),
      b = be(y),
      O = function (e) {
        return (A = e);
      },
      M = function (e) {
        return (y = e);
      };
    (h.deny = n(!1)),
      (h.approve = n(!0)),
      (h.denyAll = h.deny.bind(h, pe)),
      (h.approveAll = h.approve.bind(h, pe)),
      (h.isApproved = function (t) {
        return e(t, h.permissions);
      }),
      (h.isPreApproved = function (t) {
        return e(t, v);
      }),
      (h.fetchPermissions = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          n = t ? h.on(ce.COMPLETE, e) : Le;
        return (
          !r || (r && h.isComplete) || !!o
            ? e(h.permissions)
            : t ||
              C.add(xe, function () {
                return e(h.permissions);
              }),
          n
        );
      }),
      (h.complete = function () {
        h.status === ce.CHANGED && t();
      }),
      (h.registerPlugin = function (e) {
        if (!e || !e.name || "function" != typeof e.onRegister)
          throw new Error(je);
        D[e.name] || ((D[e.name] = e), e.onRegister.call(e, h));
      }),
      (h.execute = Ne(D)),
      Object.defineProperties(h, {
        permissions: {
          get: function () {
            return y;
          },
        },
        status: {
          get: function () {
            return A;
          },
        },
        Categories: {
          get: function () {
            return ue;
          },
        },
        doesOptInApply: {
          get: function () {
            return !!r;
          },
        },
        isPending: {
          get: function () {
            return h.status === ce.PENDING;
          },
        },
        isComplete: {
          get: function () {
            return h.status === ce.COMPLETE;
          },
        },
        __plugins: {
          get: function () {
            return Object.keys(D);
          },
        },
        isIabContext: {
          get: function () {
            return u;
          },
        },
      });
  }
  function g(e, t) {
    function n() {
      (r = null), e.call(e, new f("The call took longer than you wanted!"));
    }
    function i() {
      r && (clearTimeout(r), e.apply(e, arguments));
    }
    if (void 0 === t) return e;
    var r = setTimeout(n, t);
    return i;
  }
  function m() {
    if (window.__cmp) return window.__cmp;
    var e = window;
    if (e === window.top) return void Ie.error("__cmp not found");
    for (var t; !t; ) {
      e = e.parent;
      try {
        e.frames.__cmpLocator && (t = e);
      } catch (e) {}
      if (e === window.top) break;
    }
    if (!t) return void Ie.error("__cmp not found");
    var n = {};
    return (
      (window.__cmp = function (e, i, r) {
        var a = Math.random() + "",
          o = { __cmpCall: { command: e, parameter: i, callId: a } };
        (n[a] = r), t.postMessage(o, "*");
      }),
      window.addEventListener(
        "message",
        function (e) {
          var t = e.data;
          if ("string" == typeof t)
            try {
              t = JSON.parse(e.data);
            } catch (e) {}
          if (t.__cmpReturn) {
            var i = t.__cmpReturn;
            n[i.callId] &&
              (n[i.callId](i.returnValue, i.success), delete n[i.callId]);
          }
        },
        !1
      ),
      window.__cmp
    );
  }
  function h() {
    var e = this;
    (e.name = "iabPlugin"), (e.version = "0.0.1");
    var t = ge(),
      n = { allConsentData: null },
      i = function (e) {
        var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return (n[e] = t);
      };
    (e.fetchConsentData = function (e) {
      var t = e.callback,
        n = e.timeout,
        i = g(t, n);
      r({ callback: i });
    }),
      (e.isApproved = function (e) {
        var t = e.callback,
          i = e.category,
          a = e.timeout;
        if (n.allConsentData)
          return t(
            null,
            s(
              i,
              n.allConsentData.vendorConsents,
              n.allConsentData.purposeConsents
            )
          );
        var o = g(function (e) {
          var n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = n.vendorConsents,
            a = n.purposeConsents;
          t(e, s(i, r, a));
        }, a);
        r({ category: i, callback: o });
      }),
      (e.onRegister = function (t) {
        var n = Object.keys(de),
          i = function (e) {
            var i =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              r = i.purposeConsents,
              a = i.gdprApplies,
              o = i.vendorConsents;
            !e &&
              a &&
              o &&
              r &&
              (n.forEach(function (e) {
                var n = s(e, o, r);
                t[n ? "approve" : "deny"](e, !0);
              }),
              t.complete());
          };
        e.fetchConsentData({ callback: i });
      });
    var r = function (e) {
        var r = e.callback;
        if (n.allConsentData) return r(null, n.allConsentData);
        t.add("FETCH_CONSENT_DATA", r);
        var s = {};
        o(function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            r = e.purposeConsents,
            o = e.gdprApplies,
            l = e.vendorConsents;
          (arguments.length > 1 ? arguments[1] : void 0) &&
            ((s = { purposeConsents: r, gdprApplies: o, vendorConsents: l }),
            i("allConsentData", s)),
            a(function () {
              var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              (arguments.length > 1 ? arguments[1] : void 0) &&
                ((s.consentString = e.consentData), i("allConsentData", s)),
                t.execute("FETCH_CONSENT_DATA", [null, n.allConsentData]);
            });
        });
      },
      a = function (e) {
        var t = m();
        t && t("getConsentData", null, e);
      },
      o = function (e) {
        var t = Fe(de),
          n = m();
        n && n("getVendorConsents", t, e);
      },
      s = function (e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          i = !!t[de[e]];
        return (
          i &&
          (function () {
            return fe[e].every(function (e) {
              return n[e];
            });
          })()
        );
      };
  }
  var _ =
    "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : "undefined" != typeof self
      ? self
      : {};
  Object.assign =
    Object.assign ||
    function (e) {
      for (var t, n, i = 1; i < arguments.length; ++i) {
        n = arguments[i];
        for (t in n)
          Object.prototype.hasOwnProperty.call(n, t) && (e[t] = n[t]);
      }
      return e;
    };
  var C,
    I,
    v = {
      HANDSHAKE: "HANDSHAKE",
      GETSTATE: "GETSTATE",
      PARENTSTATE: "PARENTSTATE",
    },
    S = {
      MCMID: "MCMID",
      MCAID: "MCAID",
      MCAAMB: "MCAAMB",
      MCAAMLH: "MCAAMLH",
      MCOPTOUT: "MCOPTOUT",
      CUSTOMERIDS: "CUSTOMERIDS",
    },
    D = {
      MCMID: "getMarketingCloudVisitorID",
      MCAID: "getAnalyticsVisitorID",
      MCAAMB: "getAudienceManagerBlob",
      MCAAMLH: "getAudienceManagerLocationHint",
      MCOPTOUT: "isOptedOut",
      ALLFIELDS: "getVisitorValues",
    },
    A = { CUSTOMERIDS: "getCustomerIDs" },
    y = {
      MCMID: "getMarketingCloudVisitorID",
      MCAAMB: "getAudienceManagerBlob",
      MCAAMLH: "getAudienceManagerLocationHint",
      MCOPTOUT: "isOptedOut",
      MCAID: "getAnalyticsVisitorID",
      CUSTOMERIDS: "getCustomerIDs",
      ALLFIELDS: "getVisitorValues",
    },
    b = { MC: "MCMID", A: "MCAID", AAM: "MCAAMB" },
    O = {
      MCMID: "MCMID",
      MCOPTOUT: "MCOPTOUT",
      MCAID: "MCAID",
      MCAAMLH: "MCAAMLH",
      MCAAMB: "MCAAMB",
    },
    M = { UNKNOWN: 0, AUTHENTICATED: 1, LOGGED_OUT: 2 },
    k = { GLOBAL: "global" },
    E = {
      MESSAGES: v,
      STATE_KEYS_MAP: S,
      ASYNC_API_MAP: D,
      SYNC_API_MAP: A,
      ALL_APIS: y,
      FIELDGROUP_TO_FIELD: b,
      FIELDS: O,
      AUTH_STATE: M,
      OPT_OUT: k,
    },
    T = E.STATE_KEYS_MAP,
    L = function (e) {
      function t() {}
      function n(t, n) {
        var i = this;
        return function () {
          var r = e(0, t),
            a = {};
          return (a[t] = r), i.setStateAndPublish(a), n(r), r;
        };
      }
      (this.getMarketingCloudVisitorID = function (e) {
        e = e || t;
        var i = this.findField(T.MCMID, e),
          r = n.call(this, T.MCMID, e);
        return void 0 !== i ? i : r();
      }),
        (this.getVisitorValues = function (e) {
          this.getMarketingCloudVisitorID(function (t) {
            e({ MCMID: t });
          });
        });
    },
    P = E.MESSAGES,
    R = E.ASYNC_API_MAP,
    w = E.SYNC_API_MAP,
    F = function () {
      function e() {}
      function t(e, t) {
        var n = this;
        return function () {
          return n.callbackRegistry.add(e, t), n.messageParent(P.GETSTATE), "";
        };
      }
      function n(n) {
        this[R[n]] = function (i) {
          i = i || e;
          var r = this.findField(n, i),
            a = t.call(this, n, i);
          return void 0 !== r ? r : a();
        };
      }
      function i(t) {
        this[w[t]] = function () {
          return this.findField(t, e) || {};
        };
      }
      Object.keys(R).forEach(n, this), Object.keys(w).forEach(i, this);
    },
    N = E.ASYNC_API_MAP,
    x = function () {
      Object.keys(N).forEach(function (e) {
        this[N[e]] = function (t) {
          this.callbackRegistry.add(e, t);
        };
      }, this);
    },
    j = (function (e, t) {
      return (t = { exports: {} }), e(t, t.exports), t.exports;
    })(function (t, n) {
      (n.isObjectEmpty = function (e) {
        return e === Object(e) && 0 === Object.keys(e).length;
      }),
        (n.isValueEmpty = function (e) {
          return "" === e || n.isObjectEmpty(e);
        }),
        (n.getIeVersion = function () {
          if (document.documentMode) return document.documentMode;
          for (var e = 7; e > 4; e--) {
            var t = document.createElement("div");
            if (
              ((t.innerHTML =
                "\x3c!--[if IE " + e + "]><span></span><![endif]--\x3e"),
              t.getElementsByTagName("span").length)
            )
              return (t = null), e;
            t = null;
          }
          return null;
        }),
        (n.encodeAndBuildRequest = function (e, t) {
          return e.map(encodeURIComponent).join(t);
        }),
        (n.isObject = function (t) {
          return null !== t && "object" === e(t) && !1 === Array.isArray(t);
        }),
        (n.defineGlobalNamespace = function () {
          return (
            (window.adobe = n.isObject(window.adobe) ? window.adobe : {}),
            window.adobe
          );
        }),
        (n.pluck = function (e, t) {
          return t.reduce(function (t, n) {
            return e[n] && (t[n] = e[n]), t;
          }, Object.create(null));
        }),
        (n.parseOptOut = function (e, t, n) {
          t ||
            ((t = n),
            e.d_optout &&
              e.d_optout instanceof Array &&
              (t = e.d_optout.join(",")));
          var i = parseInt(e.d_ottl, 10);
          return isNaN(i) && (i = 7200), { optOut: t, d_ottl: i };
        }),
        (n.normalizeBoolean = function (e) {
          var t = e;
          return "true" === e ? (t = !0) : "false" === e && (t = !1), t;
        });
    }),
    V =
      (j.isObjectEmpty,
      j.isValueEmpty,
      j.getIeVersion,
      j.encodeAndBuildRequest,
      j.isObject,
      j.defineGlobalNamespace,
      j.pluck,
      j.parseOptOut,
      j.normalizeBoolean,
      n),
    H = E.MESSAGES,
    U = { 0: "prefix", 1: "orgID", 2: "state" },
    B = function (e, t) {
      (this.parse = function (e) {
        try {
          var t = {};
          return (
            e.data.split("|").forEach(function (e, n) {
              if (void 0 !== e) {
                t[U[n]] = 2 !== n ? e : JSON.parse(e);
              }
            }),
            t
          );
        } catch (e) {}
      }),
        (this.isInvalid = function (n) {
          var i = this.parse(n);
          if (!i || Object.keys(i).length < 2) return !0;
          var r = e !== i.orgID,
            a = !t || n.origin !== t,
            o = -1 === Object.keys(H).indexOf(i.prefix);
          return r || a || o;
        }),
        (this.send = function (n, i, r) {
          var a = i + "|" + e;
          r && r === Object(r) && (a += "|" + JSON.stringify(r));
          try {
            n.postMessage(a, t);
          } catch (e) {}
        });
    },
    G = E.MESSAGES,
    Y = function (e, t, n, i) {
      function r(e) {
        Object.assign(p, e);
      }
      function a(e) {
        Object.assign(p.state, e),
          Object.assign(p.state.ALLFIELDS, e),
          p.callbackRegistry.executeAll(p.state);
      }
      function o(e) {
        if (!h.isInvalid(e)) {
          m = !1;
          var t = h.parse(e);
          p.setStateAndPublish(t.state);
        }
      }
      function s(e) {
        !m && g && ((m = !0), h.send(i, e));
      }
      function l() {
        r(new L(n._generateID)),
          p.getMarketingCloudVisitorID(),
          p.callbackRegistry.executeAll(p.state, !0),
          _.removeEventListener("message", c);
      }
      function c(e) {
        if (!h.isInvalid(e)) {
          var t = h.parse(e);
          (m = !1),
            _.clearTimeout(p._handshakeTimeout),
            _.removeEventListener("message", c),
            r(new F(p)),
            _.addEventListener("message", o),
            p.setStateAndPublish(t.state),
            p.callbackRegistry.hasCallbacks() && s(G.GETSTATE);
        }
      }
      function u() {
        g && postMessage
          ? (_.addEventListener("message", c),
            s(G.HANDSHAKE),
            (p._handshakeTimeout = setTimeout(l, 250)))
          : l();
      }
      function d() {
        _.s_c_in || ((_.s_c_il = []), (_.s_c_in = 0)),
          (p._c = "Visitor"),
          (p._il = _.s_c_il),
          (p._in = _.s_c_in),
          (p._il[p._in] = p),
          _.s_c_in++;
      }
      function f() {
        function e(e) {
          0 !== e.indexOf("_") &&
            "function" == typeof n[e] &&
            (p[e] = function () {});
        }
        Object.keys(n).forEach(e),
          (p.getSupplementalDataID = n.getSupplementalDataID),
          (p.isAllowed = function () {
            return !0;
          });
      }
      var p = this,
        g = t.whitelistParentDomain;
      (p.state = { ALLFIELDS: {} }),
        (p.version = n.version),
        (p.marketingCloudOrgID = e),
        (p.cookieDomain = n.cookieDomain || ""),
        (p._instanceType = "child");
      var m = !1,
        h = new B(e, g);
      (p.callbackRegistry = V()),
        (p.init = function () {
          d(), f(), r(new x(p)), u();
        }),
        (p.findField = function (e, t) {
          if (void 0 !== p.state[e]) return t(p.state[e]), p.state[e];
        }),
        (p.messageParent = s),
        (p.setStateAndPublish = a);
    },
    q = E.MESSAGES,
    X = E.ALL_APIS,
    W = E.ASYNC_API_MAP,
    J = E.FIELDGROUP_TO_FIELD,
    K = function (e, t) {
      function n() {
        var t = {};
        return (
          Object.keys(X).forEach(function (n) {
            var i = X[n],
              r = e[i]();
            j.isValueEmpty(r) || (t[n] = r);
          }),
          t
        );
      }
      function i() {
        var t = [];
        return (
          e._loading &&
            Object.keys(e._loading).forEach(function (n) {
              if (e._loading[n]) {
                var i = J[n];
                t.push(i);
              }
            }),
          t.length ? t : null
        );
      }
      function r(t) {
        return function n(r) {
          var a = i();
          if (a) {
            var o = W[a[0]];
            e[o](n, !0);
          } else t();
        };
      }
      function a(e, i) {
        var r = n();
        t.send(e, i, r);
      }
      function o(e) {
        l(e), a(e, q.HANDSHAKE);
      }
      function s(e) {
        r(function () {
          a(e, q.PARENTSTATE);
        })();
      }
      function l(n) {
        function i(i) {
          r.call(e, i),
            t.send(n, q.PARENTSTATE, { CUSTOMERIDS: e.getCustomerIDs() });
        }
        var r = e.setCustomerIDs;
        e.setCustomerIDs = i;
      }
      return function (e) {
        if (!t.isInvalid(e)) {
          (t.parse(e).prefix === q.HANDSHAKE ? o : s)(e.source);
        }
      };
    },
    z = function (e, t) {
      function n(e) {
        return function (n) {
          (i[e] = n), r++, r === a && t(i);
        };
      }
      var i = {},
        r = 0,
        a = Object.keys(e).length;
      Object.keys(e).forEach(function (t) {
        var i = e[t];
        if (i.fn) {
          var r = i.args || [];
          r.unshift(n(t)), i.fn.apply(i.context || null, r);
        }
      });
    },
    Q = {
      get: function (e) {
        e = encodeURIComponent(e);
        var t = (";" + document.cookie).split(" ").join(";"),
          n = t.indexOf(";" + e + "="),
          i = n < 0 ? n : t.indexOf(";", n + 1);
        return n < 0
          ? ""
          : decodeURIComponent(
              t.substring(n + 2 + e.length, i < 0 ? t.length : i)
            );
      },
      set: function (e, t, n) {
        var r = i(n, "cookieLifetime"),
          a = i(n, "expires"),
          o = i(n, "domain"),
          s = i(n, "secure"),
          l = s ? "Secure" : "";
        if (a && "SESSION" !== r && "NONE" !== r) {
          var c = "" !== t ? parseInt(r || 0, 10) : -60;
          if (c) (a = new Date()), a.setTime(a.getTime() + 1e3 * c);
          else if (1 === a) {
            a = new Date();
            var u = a.getYear();
            a.setYear(u + 2 + (u < 1900 ? 1900 : 0));
          }
        } else a = 0;
        return e && "NONE" !== r
          ? ((document.cookie =
              encodeURIComponent(e) +
              "=" +
              encodeURIComponent(t) +
              "; path=/;" +
              (a ? " expires=" + a.toGMTString() + ";" : "") +
              (o ? " domain=" + o + ";" : "") +
              l),
            this.get(e) === t)
          : 0;
      },
      remove: function (e, t) {
        var n = i(t, "domain");
        (n = n ? " domain=" + n + ";" : ""),
          (document.cookie =
            encodeURIComponent(e) +
            "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;" +
            n);
      },
    },
    $ = function (e) {
      var t;
      !e && _.location && (e = _.location.hostname), (t = e);
      var n,
        i = t.split(".");
      for (n = i.length - 2; n >= 0; n--)
        if (
          ((t = i.slice(n).join(".")), Q.set("test", "cookie", { domain: t }))
        )
          return Q.remove("test", { domain: t }), t;
      return "";
    },
    Z = {
      compare: s,
      isLessThan: function (e, t) {
        return s(e, t) < 0;
      },
      areVersionsDifferent: function (e, t) {
        return 0 !== s(e, t);
      },
      isGreaterThan: function (e, t) {
        return s(e, t) > 0;
      },
      isEqual: function (e, t) {
        return 0 === s(e, t);
      },
    },
    ee = !!_.postMessage,
    te = {
      postMessage: function (e, t, n) {
        var i = 1;
        t &&
          (ee
            ? n.postMessage(e, t.replace(/([^:]+:\/\/[^\/]+).*/, "$1"))
            : t &&
              (n.location =
                t.replace(/#.*$/, "") + "#" + +new Date() + i++ + "&" + e));
      },
      receiveMessage: function (e, t) {
        var n;
        try {
          ee &&
            (e &&
              (n = function (n) {
                if (
                  ("string" == typeof t && n.origin !== t) ||
                  ("[object Function]" === Object.prototype.toString.call(t) &&
                    !1 === t(n.origin))
                )
                  return !1;
                e(n);
              }),
            _.addEventListener
              ? _[e ? "addEventListener" : "removeEventListener"]("message", n)
              : _[e ? "attachEvent" : "detachEvent"]("onmessage", n));
        } catch (e) {}
      },
    },
    ne = function (e) {
      var t,
        n,
        i = "0123456789",
        r = "",
        a = "",
        o = 8,
        s = 10,
        l = 10;
      if (1 == e) {
        for (i += "ABCDEF", t = 0; 16 > t; t++)
          (n = Math.floor(Math.random() * o)),
            (r += i.substring(n, n + 1)),
            (n = Math.floor(Math.random() * o)),
            (a += i.substring(n, n + 1)),
            (o = 16);
        return r + "-" + a;
      }
      for (t = 0; 19 > t; t++)
        (n = Math.floor(Math.random() * s)),
          (r += i.substring(n, n + 1)),
          0 === t && 9 == n
            ? (s = 3)
            : (1 == t || 2 == t) && 10 != s && 2 > n
            ? (s = 10)
            : 2 < t && (s = 10),
          (n = Math.floor(Math.random() * l)),
          (a += i.substring(n, n + 1)),
          0 === t && 9 == n
            ? (l = 3)
            : (1 == t || 2 == t) && 10 != l && 2 > n
            ? (l = 10)
            : 2 < t && (l = 10);
      return r + a;
    },
    ie = function (e, t) {
      return {
        corsMetadata: (function () {
          var e = "none",
            t = !0;
          return (
            "undefined" != typeof XMLHttpRequest &&
              XMLHttpRequest === Object(XMLHttpRequest) &&
              ("withCredentials" in new XMLHttpRequest()
                ? (e = "XMLHttpRequest")
                : "undefined" != typeof XDomainRequest &&
                  XDomainRequest === Object(XDomainRequest) &&
                  (t = !1),
              Object.prototype.toString
                .call(_.HTMLElement)
                .indexOf("Constructor") > 0 && (t = !1)),
            { corsType: e, corsCookiesEnabled: t }
          );
        })(),
        getCORSInstance: function () {
          return "none" === this.corsMetadata.corsType
            ? null
            : new _[this.corsMetadata.corsType]();
        },
        fireCORS: function (t, n, i) {
          function r(e) {
            var n;
            try {
              if ((n = JSON.parse(e)) !== Object(n))
                return void a.handleCORSError(t, null, "Response is not JSON");
            } catch (e) {
              return void a.handleCORSError(
                t,
                e,
                "Error parsing response as JSON"
              );
            }
            try {
              for (var i = t.callback, r = _, o = 0; o < i.length; o++)
                r = r[i[o]];
              r(n);
            } catch (e) {
              a.handleCORSError(t, e, "Error forming callback function");
            }
          }
          var a = this;
          n && (t.loadErrorHandler = n);
          try {
            var o = this.getCORSInstance();
            o.open("get", t.corsUrl + "&ts=" + new Date().getTime(), !0),
              "XMLHttpRequest" === this.corsMetadata.corsType &&
                ((o.withCredentials = !0),
                (o.timeout = e.loadTimeout),
                o.setRequestHeader(
                  "Content-Type",
                  "application/x-www-form-urlencoded"
                ),
                (o.onreadystatechange = function () {
                  4 === this.readyState &&
                    200 === this.status &&
                    r(this.responseText);
                })),
              (o.onerror = function (e) {
                a.handleCORSError(t, e, "onerror");
              }),
              (o.ontimeout = function (e) {
                a.handleCORSError(t, e, "ontimeout");
              }),
              o.send(),
              e._log.requests.push(t.corsUrl);
          } catch (e) {
            this.handleCORSError(t, e, "try-catch");
          }
        },
        handleCORSError: function (t, n, i) {
          e.CORSErrors.push({ corsData: t, error: n, description: i }),
            t.loadErrorHandler &&
              ("ontimeout" === i
                ? t.loadErrorHandler(!0)
                : t.loadErrorHandler(!1));
        },
      };
    },
    re = {
      POST_MESSAGE_ENABLED: !!_.postMessage,
      DAYS_BETWEEN_SYNC_ID_CALLS: 1,
      MILLIS_PER_DAY: 864e5,
      ADOBE_MC: "adobe_mc",
      ADOBE_MC_SDID: "adobe_mc_sdid",
      VALID_VISITOR_ID_REGEX: /^[0-9a-fA-F\-]+$/,
      ADOBE_MC_TTL_IN_MIN: 5,
      VERSION_REGEX: /vVersion\|((\d+\.)?(\d+\.)?(\*|\d+))(?=$|\|)/,
      FIRST_PARTY_SERVER_COOKIE: "s_ecid",
    },
    ae = function (e, t) {
      var n = _.document;
      return {
        THROTTLE_START: 3e4,
        MAX_SYNCS_LENGTH: 649,
        throttleTimerSet: !1,
        id: null,
        onPagePixels: [],
        iframeHost: null,
        getIframeHost: function (e) {
          if ("string" == typeof e) {
            var t = e.split("/");
            return t[0] + "//" + t[2];
          }
        },
        subdomain: null,
        url: null,
        getUrl: function () {
          var t,
            i = "http://fast.",
            r =
              "?d_nsid=" +
              e.idSyncContainerID +
              "#" +
              encodeURIComponent(n.location.origin);
          return (
            this.subdomain || (this.subdomain = "nosubdomainreturned"),
            e.loadSSL &&
              (i = e.idSyncSSLUseAkamai ? "https://fast." : "https://"),
            (t = i + this.subdomain + ".demdex.net/dest5.html" + r),
            (this.iframeHost = this.getIframeHost(t)),
            (this.id =
              "destination_publishing_iframe_" +
              this.subdomain +
              "_" +
              e.idSyncContainerID),
            t
          );
        },
        checkDPIframeSrc: function () {
          var t =
            "?d_nsid=" +
            e.idSyncContainerID +
            "#" +
            encodeURIComponent(n.location.href);
          "string" == typeof e.dpIframeSrc &&
            e.dpIframeSrc.length &&
            ((this.id =
              "destination_publishing_iframe_" +
              (e._subdomain || this.subdomain || new Date().getTime()) +
              "_" +
              e.idSyncContainerID),
            (this.iframeHost = this.getIframeHost(e.dpIframeSrc)),
            (this.url = e.dpIframeSrc + t));
        },
        idCallNotProcesssed: null,
        doAttachIframe: !1,
        startedAttachingIframe: !1,
        iframeHasLoaded: null,
        iframeIdChanged: null,
        newIframeCreated: null,
        originalIframeHasLoadedAlready: null,
        iframeLoadedCallbacks: [],
        regionChanged: !1,
        timesRegionChanged: 0,
        sendingMessages: !1,
        messages: [],
        messagesPosted: [],
        messagesReceived: [],
        messageSendingInterval: re.POST_MESSAGE_ENABLED ? null : 100,
        onPageDestinationsFired: [],
        jsonForComparison: [],
        jsonDuplicates: [],
        jsonWaiting: [],
        jsonProcessed: [],
        canSetThirdPartyCookies: !0,
        receivedThirdPartyCookiesNotification: !1,
        readyToAttachIframePreliminary: function () {
          return !(
            e.idSyncDisableSyncs ||
            e.disableIdSyncs ||
            e.idSyncDisable3rdPartySyncing ||
            e.disableThirdPartyCookies ||
            e.disableThirdPartyCalls
          );
        },
        readyToAttachIframe: function () {
          return (
            this.readyToAttachIframePreliminary() &&
            (this.doAttachIframe || e._doAttachIframe) &&
            ((this.subdomain && "nosubdomainreturned" !== this.subdomain) ||
              e._subdomain) &&
            this.url &&
            !this.startedAttachingIframe
          );
        },
        attachIframe: function () {
          function e() {
            (r = n.createElement("iframe")),
              (r.sandbox = "allow-scripts allow-same-origin"),
              (r.title = "Adobe ID Syncing iFrame"),
              (r.id = i.id),
              (r.name = i.id + "_name"),
              (r.style.cssText = "display: none; width: 0; height: 0;"),
              (r.src = i.url),
              (i.newIframeCreated = !0),
              t(),
              n.body.appendChild(r);
          }
          function t(e) {
            r.addEventListener("load", function () {
              (r.className = "aamIframeLoaded"),
                (i.iframeHasLoaded = !0),
                i.fireIframeLoadedCallbacks(e),
                i.requestToProcess();
            });
          }
          this.startedAttachingIframe = !0;
          var i = this,
            r = n.getElementById(this.id);
          r
            ? "IFRAME" !== r.nodeName
              ? ((this.id += "_2"), (this.iframeIdChanged = !0), e())
              : ((this.newIframeCreated = !1),
                "aamIframeLoaded" !== r.className
                  ? ((this.originalIframeHasLoadedAlready = !1),
                    t(
                      "The destination publishing iframe already exists from a different library, but hadn't loaded yet."
                    ))
                  : ((this.originalIframeHasLoadedAlready = !0),
                    (this.iframeHasLoaded = !0),
                    (this.iframe = r),
                    this.fireIframeLoadedCallbacks(
                      "The destination publishing iframe already exists from a different library, and had loaded alresady."
                    ),
                    this.requestToProcess()))
            : e(),
            (this.iframe = r);
        },
        fireIframeLoadedCallbacks: function (e) {
          this.iframeLoadedCallbacks.forEach(function (t) {
            "function" == typeof t &&
              t({
                message:
                  e ||
                  "The destination publishing iframe was attached and loaded successfully.",
              });
          }),
            (this.iframeLoadedCallbacks = []);
        },
        requestToProcess: function (t) {
          function n() {
            r.jsonForComparison.push(t),
              r.jsonWaiting.push(t),
              r.processSyncOnPage(t);
          }
          var i,
            r = this;
          if (t === Object(t) && t.ibs)
            if (
              ((i = JSON.stringify(t.ibs || [])), this.jsonForComparison.length)
            ) {
              var a,
                o,
                s,
                l = !1;
              for (a = 0, o = this.jsonForComparison.length; a < o; a++)
                if (
                  ((s = this.jsonForComparison[a]),
                  i === JSON.stringify(s.ibs || []))
                ) {
                  l = !0;
                  break;
                }
              l ? this.jsonDuplicates.push(t) : n();
            } else n();
          if (
            (this.receivedThirdPartyCookiesNotification ||
              !re.POST_MESSAGE_ENABLED ||
              this.iframeHasLoaded) &&
            this.jsonWaiting.length
          ) {
            var c = this.jsonWaiting.shift();
            this.process(c), this.requestToProcess();
          }
          e.idSyncDisableSyncs ||
            e.disableIdSyncs ||
            !this.iframeHasLoaded ||
            !this.messages.length ||
            this.sendingMessages ||
            (this.throttleTimerSet ||
              ((this.throttleTimerSet = !0),
              setTimeout(function () {
                r.messageSendingInterval = re.POST_MESSAGE_ENABLED ? null : 150;
              }, this.THROTTLE_START)),
            (this.sendingMessages = !0),
            this.sendMessages());
        },
        getRegionAndCheckIfChanged: function (t, n) {
          var i = e._getField("MCAAMLH"),
            r = t.d_region || t.dcs_region;
          return (
            i
              ? r &&
                (e._setFieldExpire("MCAAMLH", n),
                e._setField("MCAAMLH", r),
                parseInt(i, 10) !== r &&
                  ((this.regionChanged = !0),
                  this.timesRegionChanged++,
                  e._setField("MCSYNCSOP", ""),
                  e._setField("MCSYNCS", ""),
                  (i = r)))
              : (i = r) &&
                (e._setFieldExpire("MCAAMLH", n), e._setField("MCAAMLH", i)),
            i || (i = ""),
            i
          );
        },
        processSyncOnPage: function (e) {
          var t, n, i, r;
          if ((t = e.ibs) && t instanceof Array && (n = t.length))
            for (i = 0; i < n; i++)
              (r = t[i]),
                r.syncOnPage && this.checkFirstPartyCookie(r, "", "syncOnPage");
        },
        process: function (e) {
          var t,
            n,
            i,
            r,
            a,
            o = encodeURIComponent,
            s = !1;
          if ((t = e.ibs) && t instanceof Array && (n = t.length))
            for (s = !0, i = 0; i < n; i++)
              (r = t[i]),
                (a = [
                  o("ibs"),
                  o(r.id || ""),
                  o(r.tag || ""),
                  j.encodeAndBuildRequest(r.url || [], ","),
                  o(r.ttl || ""),
                  "",
                  "",
                  r.fireURLSync ? "true" : "false",
                ]),
                r.syncOnPage ||
                  (this.canSetThirdPartyCookies
                    ? this.addMessage(a.join("|"))
                    : r.fireURLSync &&
                      this.checkFirstPartyCookie(r, a.join("|")));
          s && this.jsonProcessed.push(e);
        },
        checkFirstPartyCookie: function (t, n, i) {
          var r = "syncOnPage" === i,
            a = r ? "MCSYNCSOP" : "MCSYNCS";
          e._readVisitor();
          var o,
            s,
            l = e._getField(a),
            c = !1,
            u = !1,
            d = Math.ceil(new Date().getTime() / re.MILLIS_PER_DAY);
          l
            ? ((o = l.split("*")),
              (s = this.pruneSyncData(o, t.id, d)),
              (c = s.dataPresent),
              (u = s.dataValid),
              (c && u) || this.fireSync(r, t, n, o, a, d))
            : ((o = []), this.fireSync(r, t, n, o, a, d));
        },
        pruneSyncData: function (e, t, n) {
          var i,
            r,
            a,
            o = !1,
            s = !1;
          for (r = 0; r < e.length; r++)
            (i = e[r]),
              (a = parseInt(i.split("-")[1], 10)),
              i.match("^" + t + "-")
                ? ((o = !0), n < a ? (s = !0) : (e.splice(r, 1), r--))
                : n >= a && (e.splice(r, 1), r--);
          return { dataPresent: o, dataValid: s };
        },
        manageSyncsSize: function (e) {
          if (e.join("*").length > this.MAX_SYNCS_LENGTH)
            for (
              e.sort(function (e, t) {
                return (
                  parseInt(e.split("-")[1], 10) - parseInt(t.split("-")[1], 10)
                );
              });
              e.join("*").length > this.MAX_SYNCS_LENGTH;

            )
              e.shift();
        },
        fireSync: function (t, n, i, r, a, o) {
          var s = this;
          if (t) {
            if ("img" === n.tag) {
              var l,
                c,
                u,
                d,
                f = n.url,
                p = e.loadSSL ? "https:" : "http:";
              for (l = 0, c = f.length; l < c; l++) {
                (u = f[l]), (d = /^\/\//.test(u));
                var g = new Image();
                g.addEventListener(
                  "load",
                  (function (t, n, i, r) {
                    return function () {
                      (s.onPagePixels[t] = null), e._readVisitor();
                      var o,
                        l = e._getField(a),
                        c = [];
                      if (l) {
                        o = l.split("*");
                        var u, d, f;
                        for (u = 0, d = o.length; u < d; u++)
                          (f = o[u]), f.match("^" + n.id + "-") || c.push(f);
                      }
                      s.setSyncTrackingData(c, n, i, r);
                    };
                  })(this.onPagePixels.length, n, a, o)
                ),
                  (g.src = (d ? p : "") + u),
                  this.onPagePixels.push(g);
              }
            }
          } else this.addMessage(i), this.setSyncTrackingData(r, n, a, o);
        },
        addMessage: function (t) {
          var n = encodeURIComponent,
            i = n(
              e._enableErrorReporting ? "---destpub-debug---" : "---destpub---"
            );
          this.messages.push((re.POST_MESSAGE_ENABLED ? "" : i) + t);
        },
        setSyncTrackingData: function (t, n, i, r) {
          t.push(n.id + "-" + (r + Math.ceil(n.ttl / 60 / 24))),
            this.manageSyncsSize(t),
            e._setField(i, t.join("*"));
        },
        sendMessages: function () {
          var e,
            t = this,
            n = "",
            i = encodeURIComponent;
          this.regionChanged &&
            ((n = i("---destpub-clear-dextp---")), (this.regionChanged = !1)),
            this.messages.length
              ? re.POST_MESSAGE_ENABLED
                ? ((e =
                    n +
                    i("---destpub-combined---") +
                    this.messages.join("%01")),
                  this.postMessage(e),
                  (this.messages = []),
                  (this.sendingMessages = !1))
                : ((e = this.messages.shift()),
                  this.postMessage(n + e),
                  setTimeout(function () {
                    t.sendMessages();
                  }, this.messageSendingInterval))
              : (this.sendingMessages = !1);
        },
        postMessage: function (e) {
          te.postMessage(e, this.url, this.iframe.contentWindow),
            this.messagesPosted.push(e);
        },
        receiveMessage: function (e) {
          var t,
            n = /^---destpub-to-parent---/;
          "string" == typeof e &&
            n.test(e) &&
            ((t = e.replace(n, "").split("|")),
            "canSetThirdPartyCookies" === t[0] &&
              ((this.canSetThirdPartyCookies = "true" === t[1]),
              (this.receivedThirdPartyCookiesNotification = !0),
              this.requestToProcess()),
            this.messagesReceived.push(e));
        },
        processIDCallData: function (i) {
          (null == this.url ||
            (i.subdomain && "nosubdomainreturned" === this.subdomain)) &&
            ("string" == typeof e._subdomain && e._subdomain.length
              ? (this.subdomain = e._subdomain)
              : (this.subdomain = i.subdomain || ""),
            (this.url = this.getUrl())),
            i.ibs instanceof Array &&
              i.ibs.length &&
              (this.doAttachIframe = !0),
            this.readyToAttachIframe() &&
              (e.idSyncAttachIframeOnWindowLoad
                ? (t.windowLoaded ||
                    "complete" === n.readyState ||
                    "loaded" === n.readyState) &&
                  this.attachIframe()
                : this.attachIframeASAP()),
            "function" == typeof e.idSyncIDCallResult
              ? e.idSyncIDCallResult(i)
              : this.requestToProcess(i),
            "function" == typeof e.idSyncAfterIDCallResult &&
              e.idSyncAfterIDCallResult(i);
        },
        canMakeSyncIDCall: function (t, n) {
          return (
            e._forceSyncIDCall || !t || n - t > re.DAYS_BETWEEN_SYNC_ID_CALLS
          );
        },
        attachIframeASAP: function () {
          function e() {
            t.startedAttachingIframe ||
              (n.body ? t.attachIframe() : setTimeout(e, 30));
          }
          var t = this;
          e();
        },
      };
    },
    oe = {
      audienceManagerServer: {},
      audienceManagerServerSecure: {},
      cookieDomain: {},
      cookieLifetime: {},
      cookieName: {},
      doesOptInApply: {},
      disableThirdPartyCalls: {},
      discardTrackingServerECID: {},
      idSyncAfterIDCallResult: {},
      idSyncAttachIframeOnWindowLoad: {},
      idSyncContainerID: {},
      idSyncDisable3rdPartySyncing: {},
      disableThirdPartyCookies: {},
      idSyncDisableSyncs: {},
      disableIdSyncs: {},
      idSyncIDCallResult: {},
      idSyncSSLUseAkamai: {},
      isCoopSafe: {},
      isIabContext: {},
      isOptInStorageEnabled: {},
      loadSSL: {},
      loadTimeout: {},
      marketingCloudServer: {},
      marketingCloudServerSecure: {},
      optInCookieDomain: {},
      optInStorageExpiry: {},
      overwriteCrossDomainMCIDAndAID: {},
      preOptInApprovals: {},
      previousPermissions: {},
      resetBeforeVersion: {},
      sdidParamExpiry: {},
      serverState: {},
      sessionCookieName: {},
      secureCookie: {},
      takeTimeoutMetrics: {},
      trackingServer: {},
      trackingServerSecure: {},
      whitelistIframeDomains: {},
      whitelistParentDomain: {},
    },
    se = {
      getConfigNames: function () {
        return Object.keys(oe);
      },
      getConfigs: function () {
        return oe;
      },
      normalizeConfig: function (e) {
        return "function" != typeof e ? e : e();
      },
    },
    le = function (e) {
      var t = {};
      return (
        (e.on = function (e, n, i) {
          if (!n || "function" != typeof n)
            throw new Error("[ON] Callback should be a function.");
          t.hasOwnProperty(e) || (t[e] = []);
          var r = t[e].push({ callback: n, context: i }) - 1;
          return function () {
            t[e].splice(r, 1), t[e].length || delete t[e];
          };
        }),
        (e.off = function (e, n) {
          t.hasOwnProperty(e) &&
            (t[e] = t[e].filter(function (e) {
              if (e.callback !== n) return e;
            }));
        }),
        (e.publish = function (e) {
          if (t.hasOwnProperty(e)) {
            var n = [].slice.call(arguments, 1);
            t[e].slice(0).forEach(function (e) {
              e.callback.apply(e.context, n);
            });
          }
        }),
        e.publish
      );
    },
    ce = { PENDING: "pending", CHANGED: "changed", COMPLETE: "complete" },
    ue = {
      AAM: "aam",
      ADCLOUD: "adcloud",
      ANALYTICS: "aa",
      CAMPAIGN: "campaign",
      ECID: "ecid",
      LIVEFYRE: "livefyre",
      TARGET: "target",
      VIDEO_ANALYTICS: "videoaa",
    },
    de = ((C = {}), t(C, ue.AAM, 565), t(C, ue.ECID, 565), C),
    fe = ((I = {}), t(I, ue.AAM, [1, 2, 5]), t(I, ue.ECID, [1, 2, 5]), I),
    pe = (function (e) {
      return Object.keys(e).map(function (t) {
        return e[t];
      });
    })(ue),
    ge = function () {
      var e = {};
      return (
        (e.callbacks = Object.create(null)),
        (e.add = function (t, n) {
          if (!c(n))
            throw new Error(
              "[callbackRegistryFactory] Make sure callback is a function or an array of functions."
            );
          e.callbacks[t] = e.callbacks[t] || [];
          var i = e.callbacks[t].push(n) - 1;
          return function () {
            e.callbacks[t].splice(i, 1);
          };
        }),
        (e.execute = function (t, n) {
          if (e.callbacks[t]) {
            (n = void 0 === n ? [] : n), (n = n instanceof Array ? n : [n]);
            try {
              for (; e.callbacks[t].length; ) {
                var i = e.callbacks[t].shift();
                "function" == typeof i
                  ? i.apply(null, n)
                  : i instanceof Array && i[1].apply(i[0], n);
              }
              delete e.callbacks[t];
            } catch (e) {}
          }
        }),
        (e.executeAll = function (t, n) {
          (n || (t && !l(t))) &&
            Object.keys(e.callbacks).forEach(function (n) {
              var i = void 0 !== t[n] ? t[n] : "";
              e.execute(n, i);
            }, e);
        }),
        (e.hasCallbacks = function () {
          return Boolean(Object.keys(e.callbacks).length);
        }),
        e
      );
    },
    me = function () {},
    he = function (e) {
      var t = window,
        n = t.console;
      return !!n && "function" == typeof n[e];
    },
    _e = function (e, t, n) {
      return n()
        ? function () {
            if (he(e)) {
              for (
                var n = arguments.length, i = new Array(n), r = 0;
                r < n;
                r++
              )
                i[r] = arguments[r];
              console[e].apply(console, [t].concat(i));
            }
          }
        : me;
    },
    Ce = u,
    Ie = new Ce("[ADOBE OPT-IN]"),
    ve = function (t, n) {
      return e(t) === n;
    },
    Se = function (e, t) {
      return e instanceof Array ? e : ve(e, "string") ? [e] : t || [];
    },
    De = function (e) {
      var t = Object.keys(e);
      return (
        !!t.length &&
        t.every(function (t) {
          return !0 === e[t];
        })
      );
    },
    Ae = function (e) {
      return (
        !(!e || Oe(e)) &&
        Se(e).every(function (e) {
          return pe.indexOf(e) > -1;
        })
      );
    },
    ye = function (e, t) {
      return e.reduce(function (e, n) {
        return (e[n] = t), e;
      }, {});
    },
    be = function (e) {
      return JSON.parse(JSON.stringify(e));
    },
    Oe = function (e) {
      return (
        "[object Array]" === Object.prototype.toString.call(e) && !e.length
      );
    },
    Me = function (e) {
      if (Te(e)) return e;
      try {
        return JSON.parse(e);
      } catch (e) {
        return {};
      }
    },
    ke = function (e) {
      return void 0 === e || (Te(e) ? Ae(Object.keys(e)) : Ee(e));
    },
    Ee = function (e) {
      try {
        var t = JSON.parse(e);
        return !!e && ve(e, "string") && Ae(Object.keys(t));
      } catch (e) {
        return !1;
      }
    },
    Te = function (e) {
      return null !== e && ve(e, "object") && !1 === Array.isArray(e);
    },
    Le = function () {},
    Pe = function (e) {
      return ve(e, "function") ? e() : e;
    },
    Re = function (e, t) {
      ke(e) || Ie.error("".concat(t));
    },
    we = function (e) {
      return Object.keys(e).map(function (t) {
        return e[t];
      });
    },
    Fe = function (e) {
      return we(e).filter(function (e, t, n) {
        return n.indexOf(e) === t;
      });
    },
    Ne = function (e) {
      return function () {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = t.command,
          i = t.params,
          r = void 0 === i ? {} : i,
          a = t.callback,
          o = void 0 === a ? Le : a;
        if (!n || -1 === n.indexOf("."))
          throw new Error("[OptIn.execute] Please provide a valid command.");
        try {
          var s = n.split("."),
            l = e[s[0]],
            c = s[1];
          if (!l || "function" != typeof l[c])
            throw new Error("Make sure the plugin and API name exist.");
          var u = Object.assign(r, { callback: o });
          l[c].call(l, u);
        } catch (e) {
          Ie.error("[execute] Something went wrong: " + e.message);
        }
      };
    };
  (f.prototype = Object.create(Error.prototype)), (f.prototype.constructor = f);
  var xe = "fetchPermissions",
    je = "[OptIn#registerPlugin] Plugin is invalid.";
  (p.Categories = ue), (p.TimeoutError = f);
  var Ve = Object.freeze({ OptIn: p, IabPlugin: h }),
    He = function (e, t) {
      e.publishDestinations = function (n) {
        var i = arguments[1],
          r = arguments[2];
        try {
          r = "function" == typeof r ? r : n.callback;
        } catch (e) {
          r = function () {};
        }
        var a = t;
        if (!a.readyToAttachIframePreliminary())
          return void r({
            error:
              "The destination publishing iframe is disabled in the Visitor library.",
          });
        if ("string" == typeof n) {
          if (!n.length)
            return void r({ error: "subdomain is not a populated string." });
          if (!(i instanceof Array && i.length))
            return void r({ error: "messages is not a populated array." });
          var o = !1;
          if (
            (i.forEach(function (e) {
              "string" == typeof e && e.length && (a.addMessage(e), (o = !0));
            }),
            !o)
          )
            return void r({
              error: "None of the messages are populated strings.",
            });
        } else {
          if (!j.isObject(n))
            return void r({ error: "Invalid parameters passed." });
          var s = n;
          if ("string" != typeof (n = s.subdomain) || !n.length)
            return void r({
              error: "config.subdomain is not a populated string.",
            });
          var l = s.urlDestinations;
          if (!(l instanceof Array && l.length))
            return void r({
              error: "config.urlDestinations is not a populated array.",
            });
          var c = [];
          l.forEach(function (e) {
            j.isObject(e) &&
              (e.hideReferrer
                ? e.message && a.addMessage(e.message)
                : c.push(e));
          });
          !(function e() {
            c.length &&
              setTimeout(function () {
                var t = new Image(),
                  n = c.shift();
                (t.src = n.url), a.onPageDestinationsFired.push(n), e();
              }, 100);
          })();
        }
        a.iframe
          ? (r({
              message:
                "The destination publishing iframe is already attached and loaded.",
            }),
            a.requestToProcess())
          : !e.subdomain && e._getField("MCMID")
          ? ((a.subdomain = n),
            (a.doAttachIframe = !0),
            (a.url = a.getUrl()),
            a.readyToAttachIframe()
              ? (a.iframeLoadedCallbacks.push(function (e) {
                  r({
                    message:
                      "Attempted to attach and load the destination publishing iframe through this API call. Result: " +
                      (e.message || "no result"),
                  });
                }),
                a.attachIframe())
              : r({
                  error:
                    "Encountered a problem in attempting to attach and load the destination publishing iframe through this API call.",
                }))
          : a.iframeLoadedCallbacks.push(function (e) {
              r({
                message:
                  "Attempted to attach and load the destination publishing iframe through normal Visitor API processing. Result: " +
                  (e.message || "no result"),
              });
            });
      };
    },
    Ue = function e(t) {
      function n(e, t) {
        return (e >>> t) | (e << (32 - t));
      }
      for (
        var i,
          r,
          a = Math.pow,
          o = a(2, 32),
          s = "",
          l = [],
          c = 8 * t.length,
          u = (e.h = e.h || []),
          d = (e.k = e.k || []),
          f = d.length,
          p = {},
          g = 2;
        f < 64;
        g++
      )
        if (!p[g]) {
          for (i = 0; i < 313; i += g) p[i] = g;
          (u[f] = (a(g, 0.5) * o) | 0), (d[f++] = (a(g, 1 / 3) * o) | 0);
        }
      for (t += "Â"; (t.length % 64) - 56; ) t += "\0";
      for (i = 0; i < t.length; i++) {
        if ((r = t.charCodeAt(i)) >> 8) return;
        l[i >> 2] |= r << (((3 - i) % 4) * 8);
      }
      for (l[l.length] = (c / o) | 0, l[l.length] = c, r = 0; r < l.length; ) {
        var m = l.slice(r, (r += 16)),
          h = u;
        for (u = u.slice(0, 8), i = 0; i < 64; i++) {
          var _ = m[i - 15],
            C = m[i - 2],
            I = u[0],
            v = u[4],
            S =
              u[7] +
              (n(v, 6) ^ n(v, 11) ^ n(v, 25)) +
              ((v & u[5]) ^ (~v & u[6])) +
              d[i] +
              (m[i] =
                i < 16
                  ? m[i]
                  : (m[i - 16] +
                      (n(_, 7) ^ n(_, 18) ^ (_ >>> 3)) +
                      m[i - 7] +
                      (n(C, 17) ^ n(C, 19) ^ (C >>> 10))) |
                    0);
          (u = [
            (S +
              ((n(I, 2) ^ n(I, 13) ^ n(I, 22)) +
                ((I & u[1]) ^ (I & u[2]) ^ (u[1] & u[2])))) |
              0,
          ].concat(u)),
            (u[4] = (u[4] + S) | 0);
        }
        for (i = 0; i < 8; i++) u[i] = (u[i] + h[i]) | 0;
      }
      for (i = 0; i < 8; i++)
        for (r = 3; r + 1; r--) {
          var D = (u[i] >> (8 * r)) & 255;
          s += (D < 16 ? 0 : "") + D.toString(16);
        }
      return s;
    },
    Be = function (e, t) {
      return (
        ("SHA-256" !== t &&
          "SHA256" !== t &&
          "sha256" !== t &&
          "sha-256" !== t) ||
          (e = Ue(e)),
        e
      );
    },
    Ge = function (e) {
      return String(e).trim().toLowerCase();
    },
    Ye = Ve.OptIn;
  j.defineGlobalNamespace(), (window.adobe.OptInCategories = Ye.Categories);
  var qe = function (t, n, i) {
    function r(e) {
      var t = e;
      return function (e) {
        var n = e || v.location.href;
        try {
          var i = g._extractParamFromUri(n, t);
          if (i) return w.parsePipeDelimetedKeyValues(i);
        } catch (e) {}
      };
    }
    function a(e) {
      function t(e, t, n) {
        e && e.match(re.VALID_VISITOR_ID_REGEX) && (n === A && (I = !0), t(e));
      }
      t(e[A], g.setMarketingCloudVisitorID, A),
        g._setFieldExpire(k, -1),
        t(e[O], g.setAnalyticsVisitorID);
    }
    function o(e) {
      (e = e || {}),
        (g._supplementalDataIDCurrent = e.supplementalDataIDCurrent || ""),
        (g._supplementalDataIDCurrentConsumed =
          e.supplementalDataIDCurrentConsumed || {}),
        (g._supplementalDataIDLast = e.supplementalDataIDLast || ""),
        (g._supplementalDataIDLastConsumed =
          e.supplementalDataIDLastConsumed || {});
    }
    function s(e) {
      function t(e, t, n) {
        return (n = n ? (n += "|") : n), (n += e + "=" + encodeURIComponent(t));
      }
      function n(e, n) {
        var i = n[0],
          r = n[1];
        return null != r && r !== T && (e = t(i, r, e)), e;
      }
      var i = e.reduce(n, "");
      return (function (e) {
        var t = w.getTimestampInSeconds();
        return (e = e ? (e += "|") : e), (e += "TS=" + t);
      })(i);
    }
    function l(e) {
      var t = e.minutesToLive,
        n = "";
      return (
        (g.idSyncDisableSyncs || g.disableIdSyncs) &&
          (n = n || "Error: id syncs have been disabled"),
        ("string" == typeof e.dpid && e.dpid.length) ||
          (n = n || "Error: config.dpid is empty"),
        ("string" == typeof e.url && e.url.length) ||
          (n = n || "Error: config.url is empty"),
        void 0 === t
          ? (t = 20160)
          : ((t = parseInt(t, 10)),
            (isNaN(t) || t <= 0) &&
              (n =
                n ||
                "Error: config.minutesToLive needs to be a positive number")),
        { error: n, ttl: t }
      );
    }
    function c() {
      return !!g.configs.doesOptInApply && !(m.optIn.isComplete && u());
    }
    function u() {
      return g.configs.isIabContext
        ? m.optIn.isApproved(m.optIn.Categories.ECID) && C
        : m.optIn.isApproved(m.optIn.Categories.ECID);
    }
    function d(e, t) {
      if (((C = !0), e)) throw new Error("[IAB plugin] : " + e);
      t.gdprApplies && (h = t.consentString), g.init(), p();
    }
    function f() {
      m.optIn.isApproved(m.optIn.Categories.ECID) &&
        (g.configs.isIabContext
          ? m.optIn.execute({
              command: "iabPlugin.fetchConsentData",
              callback: d,
            })
          : (g.init(), p()));
    }
    function p() {
      m.optIn.off("complete", f);
    }
    if (!i || i.split("").reverse().join("") !== t)
      throw new Error(
        "Please use `Visitor.getInstance` to instantiate Visitor."
      );
    var g = this,
      m = window.adobe,
      h = "",
      C = !1,
      I = !1;
    g.version = "4.4.0";
    var v = _,
      S = v.Visitor;
    (S.version = g.version),
      (S.AuthState = E.AUTH_STATE),
      (S.OptOut = E.OPT_OUT),
      v.s_c_in || ((v.s_c_il = []), (v.s_c_in = 0)),
      (g._c = "Visitor"),
      (g._il = v.s_c_il),
      (g._in = v.s_c_in),
      (g._il[g._in] = g),
      v.s_c_in++,
      (g._instanceType = "regular"),
      (g._log = { requests: [] }),
      (g.marketingCloudOrgID = t),
      (g.cookieName = "AMCV_" + t),
      (g.sessionCookieName = "AMCVS_" + t),
      (g.cookieDomain = $()),
      (g.loadSSL = v.location.protocol.toLowerCase().indexOf("https") >= 0),
      (g.loadTimeout = 3e4),
      (g.CORSErrors = []),
      (g.marketingCloudServer = g.audienceManagerServer = "dpm.demdex.net"),
      (g.sdidParamExpiry = 30);
    var D = null,
      A = "MCMID",
      y = "MCIDTS",
      b = "A",
      O = "MCAID",
      M = "AAM",
      k = "MCAAMB",
      T = "NONE",
      L = function (e) {
        return !Object.prototype[e];
      },
      P = ie(g);
    (g.FIELDS = E.FIELDS),
      (g.cookieRead = function (e) {
        return Q.get(e);
      }),
      (g.cookieWrite = function (e, t, n) {
        var i = g.cookieLifetime ? ("" + g.cookieLifetime).toUpperCase() : "",
          r = !1;
        return (
          g.configs &&
            g.configs.secureCookie &&
            "https:" === location.protocol &&
            (r = !0),
          Q.set(e, "" + t, {
            expires: n,
            domain: g.cookieDomain,
            cookieLifetime: i,
            secure: r,
          })
        );
      }),
      (g.resetState = function (e) {
        e ? g._mergeServerState(e) : o();
      }),
      (g._isAllowedDone = !1),
      (g._isAllowedFlag = !1),
      (g.isAllowed = function () {
        return (
          g._isAllowedDone ||
            ((g._isAllowedDone = !0),
            (g.cookieRead(g.cookieName) ||
              g.cookieWrite(g.cookieName, "T", 1)) &&
              (g._isAllowedFlag = !0)),
          "T" === g.cookieRead(g.cookieName) &&
            g._helpers.removeCookie(g.cookieName),
          g._isAllowedFlag
        );
      }),
      (g.setMarketingCloudVisitorID = function (e) {
        g._setMarketingCloudFields(e);
      }),
      (g._use1stPartyMarketingCloudServer = !1),
      (g.getMarketingCloudVisitorID = function (e, t) {
        g.marketingCloudServer &&
          g.marketingCloudServer.indexOf(".demdex.net") < 0 &&
          (g._use1stPartyMarketingCloudServer = !0);
        var n = g._getAudienceManagerURLData("_setMarketingCloudFields"),
          i = n.url;
        return g._getRemoteField(A, i, e, t, n);
      }),
      (g.getVisitorValues = function (e, t) {
        var n = {
            MCMID: { fn: g.getMarketingCloudVisitorID, args: [!0], context: g },
            MCOPTOUT: { fn: g.isOptedOut, args: [void 0, !0], context: g },
            MCAID: { fn: g.getAnalyticsVisitorID, args: [!0], context: g },
            MCAAMLH: {
              fn: g.getAudienceManagerLocationHint,
              args: [!0],
              context: g,
            },
            MCAAMB: { fn: g.getAudienceManagerBlob, args: [!0], context: g },
          },
          i = t && t.length ? j.pluck(n, t) : n;
        z(i, e);
      }),
      (g._currentCustomerIDs = {}),
      (g._customerIDsHashChanged = !1),
      (g._newCustomerIDsHash = ""),
      (g.setCustomerIDs = function (t, n) {
        function i() {
          g._customerIDsHashChanged = !1;
        }
        if (!g.isOptedOut() && t) {
          if (!j.isObject(t) || j.isObjectEmpty(t)) return !1;
          g._readVisitor();
          var r, a, o;
          for (r in t)
            if (
              L(r) &&
              ((a = t[r]),
              (n = a.hasOwnProperty("hashType") ? a.hashType : n),
              a)
            )
              if ("object" === e(a)) {
                var s = {};
                if (a.id) {
                  if (n) {
                    if (!(o = Be(Ge(a.id), n))) return;
                    (a.id = o), (s.hashType = n);
                  }
                  s.id = a.id;
                }
                void 0 != a.authState && (s.authState = a.authState),
                  (g._currentCustomerIDs[r] = s);
              } else if (n) {
                if (!(o = Be(Ge(a), n))) return;
                g._currentCustomerIDs[r] = { id: o, hashType: n };
              } else g._currentCustomerIDs[r] = { id: a };
          var l = g.getCustomerIDs(),
            c = g._getField("MCCIDH"),
            u = "";
          c || (c = 0);
          for (r in l)
            L(r) &&
              ((a = l[r]),
              (u +=
                (u ? "|" : "") +
                r +
                "|" +
                (a.id ? a.id : "") +
                (a.authState ? a.authState : "")));
          (g._newCustomerIDsHash = String(g._hash(u))),
            g._newCustomerIDsHash !== c &&
              ((g._customerIDsHashChanged = !0), g._mapCustomerIDs(i));
        }
      }),
      (g.getCustomerIDs = function () {
        g._readVisitor();
        var e,
          t,
          n = {};
        for (e in g._currentCustomerIDs)
          L(e) &&
            ((t = g._currentCustomerIDs[e]),
            n[e] || (n[e] = {}),
            t.id && (n[e].id = t.id),
            void 0 != t.authState
              ? (n[e].authState = t.authState)
              : (n[e].authState = S.AuthState.UNKNOWN),
            t.hashType && (n[e].hashType = t.hashType));
        return n;
      }),
      (g.setAnalyticsVisitorID = function (e) {
        g._setAnalyticsFields(e);
      }),
      (g.getAnalyticsVisitorID = function (e, t, n) {
        if (!w.isTrackingServerPopulated() && !n)
          return g._callCallback(e, [""]), "";
        var i = "";
        if (
          (n ||
            (i = g.getMarketingCloudVisitorID(function (t) {
              g.getAnalyticsVisitorID(e, !0);
            })),
          i || n)
        ) {
          var r = n ? g.marketingCloudServer : g.trackingServer,
            a = "";
          g.loadSSL &&
            (n
              ? g.marketingCloudServerSecure &&
                (r = g.marketingCloudServerSecure)
              : g.trackingServerSecure && (r = g.trackingServerSecure));
          var o = {};
          if (r) {
            var s = "http" + (g.loadSSL ? "s" : "") + "://" + r + "/id",
              l =
                "d_visid_ver=" +
                g.version +
                "&mcorgid=" +
                encodeURIComponent(g.marketingCloudOrgID) +
                (i ? "&mid=" + encodeURIComponent(i) : "") +
                (g.idSyncDisable3rdPartySyncing || g.disableThirdPartyCookies
                  ? "&d_coppa=true"
                  : ""),
              c = [
                "s_c_il",
                g._in,
                "_set" + (n ? "MarketingCloud" : "Analytics") + "Fields",
              ];
            (a =
              s +
              "?" +
              l +
              "&callback=s_c_il%5B" +
              g._in +
              "%5D._set" +
              (n ? "MarketingCloud" : "Analytics") +
              "Fields"),
              (o.corsUrl = s + "?" + l),
              (o.callback = c);
          }
          return (o.url = a), g._getRemoteField(n ? A : O, a, e, t, o);
        }
        return "";
      }),
      (g.getAudienceManagerLocationHint = function (e, t) {
        if (
          g.getMarketingCloudVisitorID(function (t) {
            g.getAudienceManagerLocationHint(e, !0);
          })
        ) {
          var n = g._getField(O);
          if (
            (!n &&
              w.isTrackingServerPopulated() &&
              (n = g.getAnalyticsVisitorID(function (t) {
                g.getAudienceManagerLocationHint(e, !0);
              })),
            n || !w.isTrackingServerPopulated())
          ) {
            var i = g._getAudienceManagerURLData(),
              r = i.url;
            return g._getRemoteField("MCAAMLH", r, e, t, i);
          }
        }
        return "";
      }),
      (g.getLocationHint = g.getAudienceManagerLocationHint),
      (g.getAudienceManagerBlob = function (e, t) {
        if (
          g.getMarketingCloudVisitorID(function (t) {
            g.getAudienceManagerBlob(e, !0);
          })
        ) {
          var n = g._getField(O);
          if (
            (!n &&
              w.isTrackingServerPopulated() &&
              (n = g.getAnalyticsVisitorID(function (t) {
                g.getAudienceManagerBlob(e, !0);
              })),
            n || !w.isTrackingServerPopulated())
          ) {
            var i = g._getAudienceManagerURLData(),
              r = i.url;
            return (
              g._customerIDsHashChanged && g._setFieldExpire(k, -1),
              g._getRemoteField(k, r, e, t, i)
            );
          }
        }
        return "";
      }),
      (g._supplementalDataIDCurrent = ""),
      (g._supplementalDataIDCurrentConsumed = {}),
      (g._supplementalDataIDLast = ""),
      (g._supplementalDataIDLastConsumed = {}),
      (g.getSupplementalDataID = function (e, t) {
        g._supplementalDataIDCurrent ||
          t ||
          (g._supplementalDataIDCurrent = g._generateID(1));
        var n = g._supplementalDataIDCurrent;
        return (
          g._supplementalDataIDLast && !g._supplementalDataIDLastConsumed[e]
            ? ((n = g._supplementalDataIDLast),
              (g._supplementalDataIDLastConsumed[e] = !0))
            : n &&
              (g._supplementalDataIDCurrentConsumed[e] &&
                ((g._supplementalDataIDLast = g._supplementalDataIDCurrent),
                (g._supplementalDataIDLastConsumed =
                  g._supplementalDataIDCurrentConsumed),
                (g._supplementalDataIDCurrent = n = t ? "" : g._generateID(1)),
                (g._supplementalDataIDCurrentConsumed = {})),
              n && (g._supplementalDataIDCurrentConsumed[e] = !0)),
          n
        );
      });
    var R = !1;
    (g._liberatedOptOut = null),
      (g.getOptOut = function (e, t) {
        var n = g._getAudienceManagerURLData("_setMarketingCloudFields"),
          i = n.url;
        if (u()) return g._getRemoteField("MCOPTOUT", i, e, t, n);
        if (
          (g._registerCallback("liberatedOptOut", e),
          null !== g._liberatedOptOut)
        )
          return (
            g._callAllCallbacks("liberatedOptOut", [g._liberatedOptOut]),
            (R = !1),
            g._liberatedOptOut
          );
        if (R) return null;
        R = !0;
        var r = "liberatedGetOptOut";
        return (
          (n.corsUrl = n.corsUrl.replace(
            /dpm\.demdex\.net\/id\?/,
            "dpm.demdex.net/optOutStatus?"
          )),
          (n.callback = [r]),
          (_[r] = function (e) {
            if (e === Object(e)) {
              var t,
                n,
                i = j.parseOptOut(e, t, T);
              (t = i.optOut),
                (n = 1e3 * i.d_ottl),
                (g._liberatedOptOut = t),
                setTimeout(function () {
                  g._liberatedOptOut = null;
                }, n);
            }
            g._callAllCallbacks("liberatedOptOut", [t]), (R = !1);
          }),
          P.fireCORS(n),
          null
        );
      }),
      (g.isOptedOut = function (e, t, n) {
        t || (t = S.OptOut.GLOBAL);
        var i = g.getOptOut(function (n) {
          var i = n === S.OptOut.GLOBAL || n.indexOf(t) >= 0;
          g._callCallback(e, [i]);
        }, n);
        return i ? i === S.OptOut.GLOBAL || i.indexOf(t) >= 0 : null;
      }),
      (g._fields = null),
      (g._fieldsExpired = null),
      (g._hash = function (e) {
        var t,
          n,
          i = 0;
        if (e)
          for (t = 0; t < e.length; t++)
            (n = e.charCodeAt(t)), (i = (i << 5) - i + n), (i &= i);
        return i;
      }),
      (g._generateID = ne),
      (g._generateLocalMID = function () {
        var e = g._generateID(0);
        return (N.isClientSideMarketingCloudVisitorID = !0), e;
      }),
      (g._callbackList = null),
      (g._callCallback = function (e, t) {
        try {
          "function" == typeof e ? e.apply(v, t) : e[1].apply(e[0], t);
        } catch (e) {}
      }),
      (g._registerCallback = function (e, t) {
        t &&
          (null == g._callbackList && (g._callbackList = {}),
          void 0 == g._callbackList[e] && (g._callbackList[e] = []),
          g._callbackList[e].push(t));
      }),
      (g._callAllCallbacks = function (e, t) {
        if (null != g._callbackList) {
          var n = g._callbackList[e];
          if (n) for (; n.length > 0; ) g._callCallback(n.shift(), t);
        }
      }),
      (g._addQuerystringParam = function (e, t, n, i) {
        var r = encodeURIComponent(t) + "=" + encodeURIComponent(n),
          a = w.parseHash(e),
          o = w.hashlessUrl(e);
        if (-1 === o.indexOf("?")) return o + "?" + r + a;
        var s = o.split("?"),
          l = s[0] + "?",
          c = s[1];
        return l + w.addQueryParamAtLocation(c, r, i) + a;
      }),
      (g._extractParamFromUri = function (e, t) {
        var n = new RegExp("[\\?&#]" + t + "=([^&#]*)"),
          i = n.exec(e);
        if (i && i.length) return decodeURIComponent(i[1]);
      }),
      (g._parseAdobeMcFromUrl = r(re.ADOBE_MC)),
      (g._parseAdobeMcSdidFromUrl = r(re.ADOBE_MC_SDID)),
      (g._attemptToPopulateSdidFromUrl = function (e) {
        var n = g._parseAdobeMcSdidFromUrl(e),
          i = 1e9;
        n && n.TS && (i = w.getTimestampInSeconds() - n.TS),
          n &&
            n.SDID &&
            n.MCORGID === t &&
            i < g.sdidParamExpiry &&
            ((g._supplementalDataIDCurrent = n.SDID),
            (g._supplementalDataIDCurrentConsumed.SDID_URL_PARAM = !0));
      }),
      (g._attemptToPopulateIdsFromUrl = function () {
        var e = g._parseAdobeMcFromUrl();
        if (e && e.TS) {
          var n = w.getTimestampInSeconds(),
            i = n - e.TS;
          if (Math.floor(i / 60) > re.ADOBE_MC_TTL_IN_MIN || e.MCORGID !== t)
            return;
          a(e);
        }
      }),
      (g._mergeServerState = function (e) {
        if (e)
          try {
            if (
              ((e = (function (e) {
                return w.isObject(e) ? e : JSON.parse(e);
              })(e)),
              e[g.marketingCloudOrgID])
            ) {
              var t = e[g.marketingCloudOrgID];
              !(function (e) {
                w.isObject(e) && g.setCustomerIDs(e);
              })(t.customerIDs),
                o(t.sdid);
            }
          } catch (e) {
            throw new Error("`serverState` has an invalid format.");
          }
      }),
      (g._timeout = null),
      (g._loadData = function (e, t, n, i) {
        (t = g._addQuerystringParam(t, "d_fieldgroup", e, 1)),
          (i.url = g._addQuerystringParam(i.url, "d_fieldgroup", e, 1)),
          (i.corsUrl = g._addQuerystringParam(i.corsUrl, "d_fieldgroup", e, 1)),
          (N.fieldGroupObj[e] = !0),
          i === Object(i) &&
            i.corsUrl &&
            "XMLHttpRequest" === P.corsMetadata.corsType &&
            P.fireCORS(i, n, e);
      }),
      (g._clearTimeout = function (e) {
        null != g._timeout &&
          g._timeout[e] &&
          (clearTimeout(g._timeout[e]), (g._timeout[e] = 0));
      }),
      (g._settingsDigest = 0),
      (g._getSettingsDigest = function () {
        if (!g._settingsDigest) {
          var e = g.version;
          g.audienceManagerServer && (e += "|" + g.audienceManagerServer),
            g.audienceManagerServerSecure &&
              (e += "|" + g.audienceManagerServerSecure),
            (g._settingsDigest = g._hash(e));
        }
        return g._settingsDigest;
      }),
      (g._readVisitorDone = !1),
      (g._readVisitor = function () {
        if (!g._readVisitorDone) {
          g._readVisitorDone = !0;
          var e,
            t,
            n,
            i,
            r,
            a,
            o = g._getSettingsDigest(),
            s = !1,
            l = g.cookieRead(g.cookieName),
            c = new Date();
          if (
            (l ||
              I ||
              g.discardTrackingServerECID ||
              (l = g.cookieRead(re.FIRST_PARTY_SERVER_COOKIE)),
            null == g._fields && (g._fields = {}),
            l && "T" !== l)
          )
            for (
              l = l.split("|"),
                l[0].match(/^[\-0-9]+$/) &&
                  (parseInt(l[0], 10) !== o && (s = !0), l.shift()),
                l.length % 2 == 1 && l.pop(),
                e = 0;
              e < l.length;
              e += 2
            )
              (t = l[e].split("-")),
                (n = t[0]),
                (i = l[e + 1]),
                t.length > 1
                  ? ((r = parseInt(t[1], 10)), (a = t[1].indexOf("s") > 0))
                  : ((r = 0), (a = !1)),
                s &&
                  ("MCCIDH" === n && (i = ""),
                  r > 0 && (r = c.getTime() / 1e3 - 60)),
                n &&
                  i &&
                  (g._setField(n, i, 1),
                  r > 0 &&
                    ((g._fields["expire" + n] = r + (a ? "s" : "")),
                    (c.getTime() >= 1e3 * r ||
                      (a && !g.cookieRead(g.sessionCookieName))) &&
                      (g._fieldsExpired || (g._fieldsExpired = {}),
                      (g._fieldsExpired[n] = !0))));
          !g._getField(O) &&
            w.isTrackingServerPopulated() &&
            (l = g.cookieRead("s_vi")) &&
            ((l = l.split("|")),
            l.length > 1 &&
              l[0].indexOf("v1") >= 0 &&
              ((i = l[1]),
              (e = i.indexOf("[")),
              e >= 0 && (i = i.substring(0, e)),
              i && i.match(re.VALID_VISITOR_ID_REGEX) && g._setField(O, i)));
        }
      }),
      (g._appendVersionTo = function (e) {
        var t = "vVersion|" + g.version,
          n = e ? g._getCookieVersion(e) : null;
        return (
          n
            ? Z.areVersionsDifferent(n, g.version) &&
              (e = e.replace(re.VERSION_REGEX, t))
            : (e += (e ? "|" : "") + t),
          e
        );
      }),
      (g._writeVisitor = function () {
        var e,
          t,
          n = g._getSettingsDigest();
        for (e in g._fields)
          L(e) &&
            g._fields[e] &&
            "expire" !== e.substring(0, 6) &&
            ((t = g._fields[e]),
            (n +=
              (n ? "|" : "") +
              e +
              (g._fields["expire" + e] ? "-" + g._fields["expire" + e] : "") +
              "|" +
              t));
        (n = g._appendVersionTo(n)), g.cookieWrite(g.cookieName, n, 1);
      }),
      (g._getField = function (e, t) {
        return null == g._fields ||
          (!t && g._fieldsExpired && g._fieldsExpired[e])
          ? null
          : g._fields[e];
      }),
      (g._setField = function (e, t, n) {
        null == g._fields && (g._fields = {}),
          (g._fields[e] = t),
          n || g._writeVisitor();
      }),
      (g._getFieldList = function (e, t) {
        var n = g._getField(e, t);
        return n ? n.split("*") : null;
      }),
      (g._setFieldList = function (e, t, n) {
        g._setField(e, t ? t.join("*") : "", n);
      }),
      (g._getFieldMap = function (e, t) {
        var n = g._getFieldList(e, t);
        if (n) {
          var i,
            r = {};
          for (i = 0; i < n.length; i += 2) r[n[i]] = n[i + 1];
          return r;
        }
        return null;
      }),
      (g._setFieldMap = function (e, t, n) {
        var i,
          r = null;
        if (t) {
          r = [];
          for (i in t) L(i) && (r.push(i), r.push(t[i]));
        }
        g._setFieldList(e, r, n);
      }),
      (g._setFieldExpire = function (e, t, n) {
        var i = new Date();
        i.setTime(i.getTime() + 1e3 * t),
          null == g._fields && (g._fields = {}),
          (g._fields["expire" + e] =
            Math.floor(i.getTime() / 1e3) + (n ? "s" : "")),
          t < 0
            ? (g._fieldsExpired || (g._fieldsExpired = {}),
              (g._fieldsExpired[e] = !0))
            : g._fieldsExpired && (g._fieldsExpired[e] = !1),
          n &&
            (g.cookieRead(g.sessionCookieName) ||
              g.cookieWrite(g.sessionCookieName, "1"));
      }),
      (g._findVisitorID = function (t) {
        return (
          t &&
            ("object" === e(t) &&
              (t = t.d_mid
                ? t.d_mid
                : t.visitorID
                ? t.visitorID
                : t.id
                ? t.id
                : t.uuid
                ? t.uuid
                : "" + t),
            t && "NOTARGET" === (t = t.toUpperCase()) && (t = T),
            (t && (t === T || t.match(re.VALID_VISITOR_ID_REGEX))) || (t = "")),
          t
        );
      }),
      (g._setFields = function (t, n) {
        if (
          (g._clearTimeout(t),
          null != g._loading && (g._loading[t] = !1),
          N.fieldGroupObj[t] && N.setState(t, !1),
          "MC" === t)
        ) {
          !0 !== N.isClientSideMarketingCloudVisitorID &&
            (N.isClientSideMarketingCloudVisitorID = !1);
          var i = g._getField(A);
          if (!i || g.overwriteCrossDomainMCIDAndAID) {
            if (
              !(i = "object" === e(n) && n.mid ? n.mid : g._findVisitorID(n))
            ) {
              if (
                g._use1stPartyMarketingCloudServer &&
                !g.tried1stPartyMarketingCloudServer
              )
                return (
                  (g.tried1stPartyMarketingCloudServer = !0),
                  void g.getAnalyticsVisitorID(null, !1, !0)
                );
              i = g._generateLocalMID();
            }
            g._setField(A, i);
          }
          (i && i !== T) || (i = ""),
            "object" === e(n) &&
              ((n.d_region || n.dcs_region || n.d_blob || n.blob) &&
                g._setFields(M, n),
              g._use1stPartyMarketingCloudServer &&
                n.mid &&
                g._setFields(b, { id: n.id })),
            g._callAllCallbacks(A, [i]);
        }
        if (t === M && "object" === e(n)) {
          var r = 604800;
          void 0 != n.id_sync_ttl &&
            n.id_sync_ttl &&
            (r = parseInt(n.id_sync_ttl, 10));
          var a = F.getRegionAndCheckIfChanged(n, r);
          g._callAllCallbacks("MCAAMLH", [a]);
          var o = g._getField(k);
          (n.d_blob || n.blob) &&
            ((o = n.d_blob),
            o || (o = n.blob),
            g._setFieldExpire(k, r),
            g._setField(k, o)),
            o || (o = ""),
            g._callAllCallbacks(k, [o]),
            !n.error_msg &&
              g._newCustomerIDsHash &&
              g._setField("MCCIDH", g._newCustomerIDsHash);
        }
        if (t === b) {
          var s = g._getField(O);
          (s && !g.overwriteCrossDomainMCIDAndAID) ||
            ((s = g._findVisitorID(n)),
            s ? s !== T && g._setFieldExpire(k, -1) : (s = T),
            g._setField(O, s)),
            (s && s !== T) || (s = ""),
            g._callAllCallbacks(O, [s]);
        }
        if (g.idSyncDisableSyncs || g.disableIdSyncs)
          F.idCallNotProcesssed = !0;
        else {
          F.idCallNotProcesssed = !1;
          var l = {};
          (l.ibs = n.ibs), (l.subdomain = n.subdomain), F.processIDCallData(l);
        }
        if (n === Object(n)) {
          var c, d;
          u() && g.isAllowed() && (c = g._getField("MCOPTOUT"));
          var f = j.parseOptOut(n, c, T);
          (c = f.optOut),
            (d = f.d_ottl),
            g._setFieldExpire("MCOPTOUT", d, !0),
            g._setField("MCOPTOUT", c),
            g._callAllCallbacks("MCOPTOUT", [c]);
        }
      }),
      (g._loading = null),
      (g._getRemoteField = function (e, t, n, i, r) {
        var a,
          o = "",
          s = w.isFirstPartyAnalyticsVisitorIDCall(e),
          l = { MCAAMLH: !0, MCAAMB: !0 };
        if (u() && g.isAllowed()) {
          g._readVisitor(), (o = g._getField(e, !0 === l[e]));
          if (
            (function () {
              return (
                (!o || (g._fieldsExpired && g._fieldsExpired[e])) &&
                (!g.disableThirdPartyCalls || s)
              );
            })()
          ) {
            if (
              (e === A || "MCOPTOUT" === e
                ? (a = "MC")
                : "MCAAMLH" === e || e === k
                ? (a = M)
                : e === O && (a = b),
              a)
            )
              return (
                !t ||
                  (null != g._loading && g._loading[a]) ||
                  (null == g._loading && (g._loading = {}),
                  (g._loading[a] = !0),
                  g._loadData(
                    a,
                    t,
                    function (t) {
                      if (!g._getField(e)) {
                        t && N.setState(a, !0);
                        var n = "";
                        e === A
                          ? (n = g._generateLocalMID())
                          : a === M && (n = { error_msg: "timeout" }),
                          g._setFields(a, n);
                      }
                    },
                    r
                  )),
                g._registerCallback(e, n),
                o || (t || g._setFields(a, { id: T }), "")
              );
          } else
            o ||
              (e === A
                ? (g._registerCallback(e, n),
                  (o = g._generateLocalMID()),
                  g.setMarketingCloudVisitorID(o))
                : e === O
                ? (g._registerCallback(e, n),
                  (o = ""),
                  g.setAnalyticsVisitorID(o))
                : ((o = ""), (i = !0)));
        }
        return (
          (e !== A && e !== O) || o !== T || ((o = ""), (i = !0)),
          n && i && g._callCallback(n, [o]),
          o
        );
      }),
      (g._setMarketingCloudFields = function (e) {
        g._readVisitor(), g._setFields("MC", e);
      }),
      (g._mapCustomerIDs = function (e) {
        g.getAudienceManagerBlob(e, !0);
      }),
      (g._setAnalyticsFields = function (e) {
        g._readVisitor(), g._setFields(b, e);
      }),
      (g._setAudienceManagerFields = function (e) {
        g._readVisitor(), g._setFields(M, e);
      }),
      (g._getAudienceManagerURLData = function (e) {
        var t = g.audienceManagerServer,
          n = "",
          i = g._getField(A),
          r = g._getField(k, !0),
          a = g._getField(O),
          o = a && a !== T ? "&d_cid_ic=AVID%01" + encodeURIComponent(a) : "";
        if (
          (g.loadSSL &&
            g.audienceManagerServerSecure &&
            (t = g.audienceManagerServerSecure),
          t)
        ) {
          var s,
            l,
            c = g.getCustomerIDs();
          if (c)
            for (s in c)
              L(s) &&
                ((l = c[s]),
                (o +=
                  "&d_cid_ic=" +
                  encodeURIComponent(s) +
                  "%01" +
                  encodeURIComponent(l.id ? l.id : "") +
                  (l.authState ? "%01" + l.authState : "")));
          e || (e = "_setAudienceManagerFields");
          var u = "http" + (g.loadSSL ? "s" : "") + "://" + t + "/id",
            d =
              "d_visid_ver=" +
              g.version +
              (h && -1 !== u.indexOf("demdex.net")
                ? "&gdpr=1&gdpr_force=1&gdpr_consent=" + h
                : "") +
              "&d_rtbd=json&d_ver=2" +
              (!i && g._use1stPartyMarketingCloudServer ? "&d_verify=1" : "") +
              "&d_orgid=" +
              encodeURIComponent(g.marketingCloudOrgID) +
              "&d_nsid=" +
              (g.idSyncContainerID || 0) +
              (i ? "&d_mid=" + encodeURIComponent(i) : "") +
              (g.idSyncDisable3rdPartySyncing || g.disableThirdPartyCookies
                ? "&d_coppa=true"
                : "") +
              (!0 === D
                ? "&d_coop_safe=1"
                : !1 === D
                ? "&d_coop_unsafe=1"
                : "") +
              (r ? "&d_blob=" + encodeURIComponent(r) : "") +
              o,
            f = ["s_c_il", g._in, e];
          return (
            (n = u + "?" + d + "&d_cb=s_c_il%5B" + g._in + "%5D." + e),
            { url: n, corsUrl: u + "?" + d, callback: f }
          );
        }
        return { url: n };
      }),
      (g.appendVisitorIDsTo = function (e) {
        try {
          var t = [
            [A, g._getField(A)],
            [O, g._getField(O)],
            ["MCORGID", g.marketingCloudOrgID],
          ];
          return g._addQuerystringParam(e, re.ADOBE_MC, s(t));
        } catch (t) {
          return e;
        }
      }),
      (g.appendSupplementalDataIDTo = function (e, t) {
        if (!(t = t || g.getSupplementalDataID(w.generateRandomString(), !0)))
          return e;
        try {
          var n = s([
            ["SDID", t],
            ["MCORGID", g.marketingCloudOrgID],
          ]);
          return g._addQuerystringParam(e, re.ADOBE_MC_SDID, n);
        } catch (t) {
          return e;
        }
      });
    var w = {
      parseHash: function (e) {
        var t = e.indexOf("#");
        return t > 0 ? e.substr(t) : "";
      },
      hashlessUrl: function (e) {
        var t = e.indexOf("#");
        return t > 0 ? e.substr(0, t) : e;
      },
      addQueryParamAtLocation: function (e, t, n) {
        var i = e.split("&");
        return (n = null != n ? n : i.length), i.splice(n, 0, t), i.join("&");
      },
      isFirstPartyAnalyticsVisitorIDCall: function (e, t, n) {
        if (e !== O) return !1;
        var i;
        return (
          t || (t = g.trackingServer),
          n || (n = g.trackingServerSecure),
          !("string" != typeof (i = g.loadSSL ? n : t) || !i.length) &&
            i.indexOf("2o7.net") < 0 &&
            i.indexOf("omtrdc.net") < 0
        );
      },
      isObject: function (e) {
        return Boolean(e && e === Object(e));
      },
      removeCookie: function (e) {
        Q.remove(e, { domain: g.cookieDomain });
      },
      isTrackingServerPopulated: function () {
        return !!g.trackingServer || !!g.trackingServerSecure;
      },
      getTimestampInSeconds: function () {
        return Math.round(new Date().getTime() / 1e3);
      },
      parsePipeDelimetedKeyValues: function (e) {
        return e.split("|").reduce(function (e, t) {
          var n = t.split("=");
          return (e[n[0]] = decodeURIComponent(n[1])), e;
        }, {});
      },
      generateRandomString: function (e) {
        e = e || 5;
        for (var t = "", n = "abcdefghijklmnopqrstuvwxyz0123456789"; e--; )
          t += n[Math.floor(Math.random() * n.length)];
        return t;
      },
      normalizeBoolean: function (e) {
        return "true" === e || ("false" !== e && e);
      },
      parseBoolean: function (e) {
        return "true" === e || ("false" !== e && null);
      },
      replaceMethodsWithFunction: function (e, t) {
        for (var n in e)
          e.hasOwnProperty(n) && "function" == typeof e[n] && (e[n] = t);
        return e;
      },
    };
    g._helpers = w;
    var F = ae(g, S);
    (g._destinationPublishing = F), (g.timeoutMetricsLog = []);
    var N = {
      isClientSideMarketingCloudVisitorID: null,
      MCIDCallTimedOut: null,
      AnalyticsIDCallTimedOut: null,
      AAMIDCallTimedOut: null,
      fieldGroupObj: {},
      setState: function (e, t) {
        switch (e) {
          case "MC":
            !1 === t
              ? !0 !== this.MCIDCallTimedOut && (this.MCIDCallTimedOut = !1)
              : (this.MCIDCallTimedOut = t);
            break;
          case b:
            !1 === t
              ? !0 !== this.AnalyticsIDCallTimedOut &&
                (this.AnalyticsIDCallTimedOut = !1)
              : (this.AnalyticsIDCallTimedOut = t);
            break;
          case M:
            !1 === t
              ? !0 !== this.AAMIDCallTimedOut && (this.AAMIDCallTimedOut = !1)
              : (this.AAMIDCallTimedOut = t);
        }
      },
    };
    (g.isClientSideMarketingCloudVisitorID = function () {
      return N.isClientSideMarketingCloudVisitorID;
    }),
      (g.MCIDCallTimedOut = function () {
        return N.MCIDCallTimedOut;
      }),
      (g.AnalyticsIDCallTimedOut = function () {
        return N.AnalyticsIDCallTimedOut;
      }),
      (g.AAMIDCallTimedOut = function () {
        return N.AAMIDCallTimedOut;
      }),
      (g.idSyncGetOnPageSyncInfo = function () {
        return g._readVisitor(), g._getField("MCSYNCSOP");
      }),
      (g.idSyncByURL = function (e) {
        if (!g.isOptedOut()) {
          var t = l(e || {});
          if (t.error) return t.error;
          var n,
            i,
            r = e.url,
            a = encodeURIComponent,
            o = F;
          return (
            (r = r.replace(/^https:/, "").replace(/^http:/, "")),
            (n = j.encodeAndBuildRequest(["", e.dpid, e.dpuuid || ""], ",")),
            (i = ["ibs", a(e.dpid), "img", a(r), t.ttl, "", n]),
            o.addMessage(i.join("|")),
            o.requestToProcess(),
            "Successfully queued"
          );
        }
      }),
      (g.idSyncByDataSource = function (e) {
        if (!g.isOptedOut())
          return e === Object(e) &&
            "string" == typeof e.dpuuid &&
            e.dpuuid.length
            ? ((e.url =
                "//dpm.demdex.net/ibs:dpid=" + e.dpid + "&dpuuid=" + e.dpuuid),
              g.idSyncByURL(e))
            : "Error: config or config.dpuuid is empty";
      }),
      He(g, F),
      (g._getCookieVersion = function (e) {
        e = e || g.cookieRead(g.cookieName);
        var t = re.VERSION_REGEX.exec(e);
        return t && t.length > 1 ? t[1] : null;
      }),
      (g._resetAmcvCookie = function (e) {
        var t = g._getCookieVersion();
        (t && !Z.isLessThan(t, e)) || w.removeCookie(g.cookieName);
      }),
      (g.setAsCoopSafe = function () {
        D = !0;
      }),
      (g.setAsCoopUnsafe = function () {
        D = !1;
      }),
      (function () {
        if (((g.configs = Object.create(null)), w.isObject(n)))
          for (var e in n) L(e) && ((g[e] = n[e]), (g.configs[e] = n[e]));
      })(),
      (function () {
        [
          ["getMarketingCloudVisitorID"],
          ["setCustomerIDs", void 0],
          ["getAnalyticsVisitorID"],
          ["getAudienceManagerLocationHint"],
          ["getLocationHint"],
          ["getAudienceManagerBlob"],
        ].forEach(function (e) {
          var t = e[0],
            n = 2 === e.length ? e[1] : "",
            i = g[t];
          g[t] = function (e) {
            return u() && g.isAllowed()
              ? i.apply(g, arguments)
              : ("function" == typeof e && g._callCallback(e, [n]), n);
          };
        });
      })(),
      (g.init = function () {
        if (c()) return m.optIn.fetchPermissions(f, !0);
        !(function () {
          if (w.isObject(n)) {
            (g.idSyncContainerID = g.idSyncContainerID || 0),
              (D =
                "boolean" == typeof g.isCoopSafe
                  ? g.isCoopSafe
                  : w.parseBoolean(g.isCoopSafe)),
              g.resetBeforeVersion && g._resetAmcvCookie(g.resetBeforeVersion),
              g._attemptToPopulateIdsFromUrl(),
              g._attemptToPopulateSdidFromUrl(),
              g._readVisitor();
            var e = g._getField(y),
              t = Math.ceil(new Date().getTime() / re.MILLIS_PER_DAY);
            g.idSyncDisableSyncs ||
              g.disableIdSyncs ||
              !F.canMakeSyncIDCall(e, t) ||
              (g._setFieldExpire(k, -1), g._setField(y, t)),
              g.getMarketingCloudVisitorID(),
              g.getAudienceManagerLocationHint(),
              g.getAudienceManagerBlob(),
              g._mergeServerState(g.serverState);
          } else
            g._attemptToPopulateIdsFromUrl(), g._attemptToPopulateSdidFromUrl();
        })(),
          (function () {
            if (!g.idSyncDisableSyncs && !g.disableIdSyncs) {
              F.checkDPIframeSrc();
              var e = function () {
                var e = F;
                e.readyToAttachIframe() && e.attachIframe();
              };
              v.addEventListener("load", function () {
                (S.windowLoaded = !0), e();
              });
              try {
                te.receiveMessage(function (e) {
                  F.receiveMessage(e.data);
                }, F.iframeHost);
              } catch (e) {}
            }
          })(),
          (function () {
            g.whitelistIframeDomains &&
              re.POST_MESSAGE_ENABLED &&
              ((g.whitelistIframeDomains =
                g.whitelistIframeDomains instanceof Array
                  ? g.whitelistIframeDomains
                  : [g.whitelistIframeDomains]),
              g.whitelistIframeDomains.forEach(function (e) {
                var n = new B(t, e),
                  i = K(g, n);
                te.receiveMessage(i, e);
              }));
          })();
      });
  };
  (qe.config = se), (_.Visitor = qe);
  var Xe = qe,
    We = function (e) {
      if (j.isObject(e))
        return Object.keys(e)
          .filter(function (t) {
            return "" !== e[t];
          })
          .reduce(function (t, n) {
            var i = "doesOptInApply" !== n ? e[n] : se.normalizeConfig(e[n]),
              r = j.normalizeBoolean(i);
            return (t[n] = r), t;
          }, Object.create(null));
    },
    Je = Ve.OptIn,
    Ke = Ve.IabPlugin;
  return (
    (Xe.getInstance = function (e, t) {
      if (!e) throw new Error("Visitor requires Adobe Marketing Cloud Org ID.");
      e.indexOf("@") < 0 && (e += "@AdobeOrg");
      var n = (function () {
        var t = _.s_c_il;
        if (t)
          for (var n = 0; n < t.length; n++) {
            var i = t[n];
            if (i && "Visitor" === i._c && i.marketingCloudOrgID === e)
              return i;
          }
      })();
      if (n) return n;
      var i = We(t);
      !(function (e) {
        _.adobe.optIn =
          _.adobe.optIn ||
          (function () {
            var t = j.pluck(e, [
                "doesOptInApply",
                "previousPermissions",
                "preOptInApprovals",
                "isOptInStorageEnabled",
                "optInStorageExpiry",
                "isIabContext",
              ]),
              n = e.optInCookieDomain || e.cookieDomain;
            (n = n || $()),
              (n = n === window.location.hostname ? "" : n),
              (t.optInCookieDomain = n);
            var i = new Je(t, { cookies: Q });
            if (t.isIabContext) {
              var r = new Ke(window.__cmp);
              i.registerPlugin(r);
            }
            return i;
          })();
      })(i || {});
      var r = e,
        a = r.split("").reverse().join(""),
        o = new Xe(e, null, a);
      j.isObject(i) && i.cookieDomain && (o.cookieDomain = i.cookieDomain),
        (function () {
          _.s_c_il.splice(--_.s_c_in, 1);
        })();
      var s = j.getIeVersion();
      if ("number" == typeof s && s < 10)
        return o._helpers.replaceMethodsWithFunction(o, function () {});
      var l =
        (function () {
          try {
            return _.self !== _.parent;
          } catch (e) {
            return !0;
          }
        })() &&
        !(function (e) {
          return (
            e.cookieWrite("TEST_AMCV_COOKIE", "T", 1),
            "T" === e.cookieRead("TEST_AMCV_COOKIE") &&
              (e._helpers.removeCookie("TEST_AMCV_COOKIE"), !0)
          );
        })(o) &&
        _.parent
          ? new Y(e, i, o, _.parent)
          : new Xe(e, i, a);
      return (o = null), l.init(), l;
    }),
    (function () {
      function e() {
        Xe.windowLoaded = !0;
      }
      _.addEventListener
        ? _.addEventListener("load", e)
        : _.attachEvent && _.attachEvent("onload", e),
        (Xe.codeLoadEnd = new Date().getTime());
    })(),
    Xe
  );
})();
window.visitor = Visitor.getInstance("675616D751E567410A490D4C@AdobeOrg", {
  trackingServer: "metrics.usbank.com",
  trackingServerSecure: "smetrics.usbank.com",
  marketingCloudServer: "metrics.usbank.com",
  marketingCloudServerSecure: "smetrics.usbank.com",
});
try {
  (function (id, loader) {
    window.utag.tagsettings = window.utag.tagsettings || {};
    window.utag.tagsettings.adobe = window.utag.tagsettings.adobe || {};
    var vAPI = (window.utag.tagsettings.adobe.visitorAPI =
      window.utag.tagsettings.adobe.visitorAPI ||
      (function () {
        function logger(msg) {
          utag.DB("[" + id + "] : " + msg);
        }
        function Observer(orgId, config) {
          var observers = [],
            visitor = {},
            demdex = null,
            instance = null,
            regex = new RegExp(
              "AMCV_" + window.encodeURIComponent(orgId) + "=(.*?)(;|$)"
            ),
            active = false,
            util = {
              hasOwn: function (o, a) {
                return o !== null && Object.prototype.hasOwnProperty.call(o, a);
              },
            },
            mTags = (function () {
              var tags = [],
                tag,
                cfg = utag.loader.cfg,
                loadcond = { 1: 1, 4: 1 };
              for (tag in cfg) {
                if (!util.hasOwn(cfg, tag)) {
                  continue;
                }
                if (cfg[tag].tid === 1191 && loadcond[cfg[tag].load]) {
                  tags.push(tag);
                }
              }
              return tags;
            })();
          function mTagsLoaded() {
            var loaded = true,
              id;
            for (var i = 0, len = mTags.length; i < len; i++) {
              id = mTags[i];
              if (!utag.loader.f[id]) {
                loaded = false;
                break;
              }
            }
            return loaded;
          }
          function notify(result) {
            instance = result;
            if (instance && instance.setCustomerIDs) {
              var aliases, alias;
              for (aliases in visitor) {
                if (util.hasOwn(visitor, aliases)) {
                  alias = visitor[aliases];
                  if (
                    alias.authState &&
                    Visitor.AuthState[alias.authState] !== undefined
                  ) {
                    alias.authState = Visitor.AuthState[alias.authState];
                  }
                }
              }
              instance.setCustomerIDs(visitor);
            }
            while (observers.length !== 0) {
              var nextCallback = observers.shift();
              nextCallback(instance);
            }
            return true;
          }
          this.sync = function (ids) {
            var alias;
            for (alias in ids) {
              if (util.hasOwn(ids, alias)) {
                if (!visitor[alias]) {
                  visitor[alias] = ids[alias];
                }
              }
            }
            return true;
          };
          this.subscribe = function (callback) {
            var self = this;
            if (instance !== null) {
              return callback(instance);
            } else {
              observers.push(callback);
              if (!active) {
                logger("demdex org id [" + orgId + "] sync requested");
                (function retry(retries) {
                  if (retries === 0) {
                    logger("demdex org id [" + orgId + "] sync timed out!");
                    active = false;
                    return notify(undefined);
                  } else {
                    active = true;
                    if (
                      regex.test(document.cookie) &&
                      /\|mcmid\|/i.test(window.decodeURIComponent(RegExp.$1)) &&
                      mTagsLoaded()
                    ) {
                      logger("demdex org id [" + orgId + "] sync completed");
                      return config
                        ? notify(window.Visitor.getInstance(orgId, config))
                        : notify(window.Visitor.getInstance(orgId));
                    } else {
                      if (window.Visitor && window.Visitor.getInstance) {
                        if (config && !demdex) {
                          demdex = window.Visitor.getInstance(orgId, config);
                        }
                      }
                      window.setTimeout(function () {
                        logger(
                          "demdex org id [" + orgId + "] sync, waiting..."
                        );
                        retry(--retries);
                      }, 25);
                    }
                  }
                })(80);
              }
            }
            return true;
          };
        }
        function VisitorAPIWrapper() {
          var observers = {};
          this._version = "1.0";
          this.getInstance = function (orgId, callback, config, customerIds) {
            if (!orgId) {
              return callback(undefined);
            }
            orgId = !/@AdobeOrg$/.test(orgId) ? orgId + "@AdobeOrg" : orgId;
            if (!observers[orgId]) {
              if (!config) {
                logger(
                  "demdex org id [" +
                    orgId +
                    "] sync error. marketing cloud tag missing demdex config"
                );
                return callback(undefined);
              }
              observers[orgId] = new Observer(orgId, config);
            }
            if (customerIds) {
              observers[orgId].sync(customerIds);
            }
            observers[orgId].subscribe(callback);
            return true;
          };
        }
        return new VisitorAPIWrapper();
      })());
    var u = { id: id };
    utag.o[loader].sender[id] = u;
    if (utag.ut === undefined) {
      utag.ut = {};
    }
    var match = /ut\d\.(\d*)\..*/.exec(utag.cfg.v);
    if (utag.ut.loader === undefined || !match || parseInt(match[1]) < 41) {
      u.loader = function (o, a, b, c, l, m) {
        utag.DB(o);
        a = document;
        if (o.type == "iframe") {
          m = a.getElementById(o.id);
          if (m && m.tagName == "IFRAME") {
            b = m;
          } else {
            b = a.createElement("iframe");
          }
          o.attrs = o.attrs || {};
          utag.ut.merge(
            o.attrs,
            { height: "1", width: "1", style: "display:none" },
            0
          );
        } else if (o.type == "img") {
          utag.DB("Attach img: " + o.src);
          b = new Image();
        } else {
          b = a.createElement("script");
          b.language = "javascript";
          b.type = "text/javascript";
          b.async = 1;
          b.charset = "utf-8";
        }
        if (o.id) {
          b.id = o.id;
        }
        for (l in utag.loader.GV(o.attrs)) {
          b.setAttribute(l, o.attrs[l]);
        }
        b.setAttribute("src", o.src);
        if (typeof o.cb == "function") {
          if (b.addEventListener) {
            b.addEventListener(
              "load",
              function () {
                o.cb();
              },
              false
            );
          } else {
            b.onreadystatechange = function () {
              if (
                this.readyState == "complete" ||
                this.readyState == "loaded"
              ) {
                this.onreadystatechange = null;
                o.cb();
              }
            };
          }
        }
        if (o.type != "img" && !m) {
          l = o.loc || "head";
          c = a.getElementsByTagName(l)[0];
          if (c) {
            utag.DB("Attach to " + l + ": " + o.src);
            if (l == "script") {
              c.parentNode.insertBefore(b, c);
            } else {
              c.appendChild(b);
            }
          }
        }
      };
    } else {
      u.loader = utag.ut.loader;
    }
    if (utag.ut.typeOf === undefined) {
      u.typeOf = function (e) {
        return {}.toString
          .call(e)
          .match(/\s([a-zA-Z]+)/)[1]
          .toLowerCase();
      };
    } else {
      u.typeOf = utag.ut.typeOf;
    }
    u.hasOwn = function (o, a) {
      return o != null && Object.prototype.hasOwnProperty.call(o, a);
    };
    u.isEmptyObject = function (o, a) {
      for (a in o) {
        if (u.hasOwn(o, a)) return false;
      }
      return true;
    };
    u.ev = { view: 1 };
    u.initialized = false;
    u.map_func = function (arr, obj, item) {
      var i = arr.shift();
      obj[i] = obj[i] || {};
      if (arr.length > 0) {
        u.map_func(arr, obj[i], item);
      } else {
        obj[i] = item;
      }
    };
    u.clearEmptyKeys = function (object) {
      for (var key in object) {
        if (object[key] === "" || object[key] === undefined) {
          delete object[key];
        }
      }
      return object;
    };
    u.map = {};
    u.extend = [];
    u.send = function (a, b) {
      if (u.ev[a] || u.ev.all !== undefined) {
        utag.DB("send:21");
        utag.DB(b);
        var c, d, e, f;
        u.data = {
          adobe_org_id: "675616D751E567410A490D4C@AdobeOrg",
          config: {
            trackingServer: "metrics.usbank.com",
            trackingServerSecure: "smetrics.usbank.com",
            marketingCloudServer: "metrics.usbank.com",
            marketingCloudServerSecure: "smetrics.usbank.com",
            cookieDomain: (function () {
              return (
                utag.loader.RC("utag_main").vapi_domain ||
                (function () {
                  var i = 0,
                    d = document.domain,
                    p = d.split("."),
                    s = "_vapi" + new Date().getTime();
                  while (
                    i < p.length - 1 &&
                    document.cookie.indexOf(s + "=" + s) === -1
                  ) {
                    d = p.slice(-1 - ++i).join(".");
                    document.cookie = s + "=" + s + ";domain=" + d + ";";
                  }
                  document.cookie =
                    s +
                    "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" +
                    d +
                    ";";
                  utag.loader.SC("utag_main", { vapi_domain: d });
                  return d;
                })()
              );
            })(),
          },
          customer_ids: {},
        };
        utag.DB("send:21:EXTENSIONS");
        utag.DB(b);
        c = [];
        for (d in utag.loader.GV(u.map)) {
          if (b[d] !== undefined && b[d] !== "") {
            e = u.map[d].split(",");
            for (f = 0; f < e.length; f++) {
              u.map_func(e[f].split("."), u.data, b[d]);
            }
          }
        }
        utag.DB("send:21:MAPPINGS");
        utag.DB(u.data);
        if (!u.data.adobe_org_id) {
          utag.DB(
            u.id +
              ": Tag not fired: Required attribute not populated [adobe_org_id]"
          );
          return;
        }
        if (!u.initialized) {
          u.initialized = !0;
          vAPI.getInstance(
            u.data.adobe_org_id,
            function (instance) {},
            u.clearEmptyKeys(u.data.config),
            u.data.customer_ids
          );
        }
        utag.DB("send:21:COMPLETE");
      }
    };
    utag.o[loader].loader.LOAD(id);
  })("21", "usbank.digital-banking");
} catch (error) {
  utag.DB(error);
}
(function () {
  if (typeof utag != "undefined") {
    utag.initcatch = true;
    for (var i in utag.loader.GV(utag.loader.cfg)) {
      var b = utag.loader.cfg[i];
      if (b.load != 4) {
        utag.initcatch = false;
        break;
      }
      if (b.wait == 1) {
        utag.initcatch = false;
        break;
      }
    }
    if (utag.initcatch) utag.handler.INIT();
  }
})();
