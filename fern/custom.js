/* ============================================================
   JSON Jet Airways — online check-in demo (/checkin-demo)

   Served from 'self' and therefore allowed by Fern's CSP, which
   has no 'unsafe-inline' for scripts. Loads site-wide, so every
   path guards on the demo container being present.
   ============================================================ */
(function () {
  "use strict";

  var URL_CI = "https://0ckcq0n1mk.execute-api.eu-central-1.amazonaws.com/Prod/check-in";

  var SAMPLE = {
    checkInStatus: "ACCEPTED", checkInId: "chk_8f3a1c92",
    lastName: "Doe", firstName: "Jamie", flightNumber: "JJ202",
    departureDate: "2027-10-10",
    departureAirport: "FRA", departureTerminal: "1",
    arrivalAirport: "JFK", arrivalTerminal: "4",
    scheduledDeparture: "2027-10-10T10:30:00Z",
    scheduledArrival: "2027-10-10T13:15:00Z",
    seat: "12K", cabinClass: "ECONOMY", zone: "3", gate: "A38",
    boardingTime: "2027-10-10T09:45:00Z",
    bookingReference: "G-JSON", pnr: "GJSON24"
  };

  function esc(s) {
    return String(s === undefined || s === null ? "" : s)
      .split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
  }

  function hhmm(iso) {
    if (!iso) return "--:--";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    var h = d.getUTCHours(), m = d.getUTCMinutes();
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

  function bars(seed) {
    var s = String(seed || "JJ") + "JSONJET", out = "";
    for (var i = 0; i < 46; i++) {
      var c = s.charCodeAt(i % s.length) + i * 7;
      out += '<i style="height:' + (34 + (c % 66)) + '%;flex:' + ((c % 3) + 1) + '"></i>';
    }
    return out;
  }

  function init() {
    var card = document.getElementById("jjc-app");
    if (!card || card.getAttribute("data-jjc-bound") === "1") return;
    card.setAttribute("data-jjc-bound", "1");

    var ln = document.getElementById("jjc-ln");
    var fn = document.getElementById("jjc-fn");
    var dd = document.getElementById("jjc-dd");
    var go = document.getElementById("jjc-go");
    var golabel = document.getElementById("jjc-golabel");
    var demo = document.getElementById("jjc-demo");
    var msg = document.getElementById("jjc-msg");
    var passwrap = document.getElementById("jjc-passwrap");
    if (!ln || !fn || !dd || !go || !msg || !passwrap) return;

    function show(kind, title, body) {
      msg.className = "jjc-msg jjc-" + kind;
      msg.innerHTML = "<strong>" + esc(title) + "</strong>" + body;
    }
    function clearMsg() { msg.className = "jjc-msg"; msg.innerHTML = ""; }

    function busy(on) {
      go.disabled = on;
      go.className = on ? "jjc-btn jjc-primary jjc-loading" : "jjc-btn jjc-primary";
      if (golabel) golabel.textContent = on ? "Checking in" : "Check in";
    }

    function render(d) {
      var name = ((d.firstName || "") + " " + (d.lastName || "")).trim() || "PASSENGER";
      var img = "";
      if (d.boardingPassImage && d.boardingPassImage.data) {
        var fmt = (d.boardingPassImage.format || "JPEG").toLowerCase();
        img = '<div class="jjc-render">' +
                '<div class="jjc-render-cap">Boarding pass returned by the API</div>' +
                '<img alt="Boarding pass" src="data:image/' + fmt + ';base64,' +
                  d.boardingPassImage.data + '" />' +
              '</div>';
      }

      var raw = JSON.parse(JSON.stringify(d));
      if (raw.boardingPassImage && raw.boardingPassImage.data) {
        raw.boardingPassImage.data = "<" + raw.boardingPassImage.data.length + " base64 chars omitted>";
      }

      passwrap.innerHTML =
        '<div class="jjc-pass">' +
          '<div class="jjc-pass-main">' +
            '<div class="jjc-pass-brandrow">' +
              '<div class="jjc-pass-brand">' +
                '<span class="jjc-pass-mark">JJ</span>' +
                '<span class="jjc-pass-airline">JSON Jet Airways<small>Boarding pass</small></span>' +
              '</div>' +
              '<span class="jjc-pill">' + esc(d.checkInStatus || "ACCEPTED") + '</span>' +
            '</div>' +
            '<div class="jjc-pass-name">' + esc(name) + '</div>' +
            '<div class="jjc-pass-sub">' + esc(d.flightNumber || "") + ' &middot; ' +
              esc(d.departureDate || "") + ' &middot; PNR ' + esc(d.pnr || "") + '</div>' +
            '<div class="jjc-route">' +
              '<div class="jjc-port">' +
                '<div class="jjc-code">' + esc(d.departureAirport || "---") + '</div>' +
                '<div class="jjc-meta">Terminal ' + esc(d.departureTerminal || "-") +
                  ' &middot; ' + hhmm(d.scheduledDeparture) + '</div>' +
              '</div>' +
              '<svg class="jjc-arc" viewBox="0 0 200 34" preserveAspectRatio="none">' +
                '<path d="M4 26 Q100 -6 196 26" fill="none" stroke="#7DD3FC" stroke-width="1.6" stroke-dasharray="5 6" opacity="0.75"/>' +
                '<circle cx="196" cy="26" r="3.4" fill="#F5B942"/>' +
              '</svg>' +
              '<div class="jjc-port">' +
                '<div class="jjc-code">' + esc(d.arrivalAirport || "---") + '</div>' +
                '<div class="jjc-meta">Terminal ' + esc(d.arrivalTerminal || "-") +
                  ' &middot; ' + hhmm(d.scheduledArrival) + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="jjc-facts">' +
              '<div class="jjc-fact jjc-hi"><div class="jjc-k">Seat</div><div class="jjc-v">' + esc(d.seat || "--") + '</div></div>' +
              '<div class="jjc-fact jjc-hi"><div class="jjc-k">Gate</div><div class="jjc-v">' + esc(d.gate || "--") + '</div></div>' +
              '<div class="jjc-fact"><div class="jjc-k">Zone</div><div class="jjc-v">' + esc(d.zone || "-") + '</div></div>' +
              '<div class="jjc-fact"><div class="jjc-k">Cabin</div><div class="jjc-v jjc-sm">' + esc(d.cabinClass || "-") + '</div></div>' +
              '<div class="jjc-fact"><div class="jjc-k">Boarding</div><div class="jjc-v">' + hhmm(d.boardingTime) + '</div></div>' +
              '<div class="jjc-fact"><div class="jjc-k">Booking</div><div class="jjc-v jjc-sm">' + esc(d.bookingReference || "-") + '</div></div>' +
            '</div>' +
          '</div>' +
          '<div class="jjc-stub">' +
            '<div><div class="jjc-k">Seat</div><div class="jjc-v">' + esc(d.seat || "--") + '</div></div>' +
            '<div><div class="jjc-k">Gate</div><div class="jjc-v">' + esc(d.gate || "--") + '</div></div>' +
            '<div><div class="jjc-k">Boarding</div><div class="jjc-v">' + hhmm(d.boardingTime) + '</div></div>' +
            '<div>' +
              '<div class="jjc-barcode">' + bars(d.pnr || d.checkInId) + '</div>' +
              '<div class="jjc-barcode-label">' + esc(d.checkInId || "") + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' + img +
        '<details class="jjc-details"><summary>Raw API response</summary><pre>' +
          esc(JSON.stringify(raw, null, 2)) + '</pre></details>';

      passwrap.className = "jjc-passwrap jjc-show";
    }

    function send() {
      clearMsg();
      passwrap.className = "jjc-passwrap";

      var payload = {
        lastName: ln.value.trim(),
        flightNumber: fn.value.trim(),
        departureDate: dd.value
      };
      if (!payload.lastName || !payload.flightNumber || !payload.departureDate) {
        show("err", "Missing details", "Last name, flight number and departure date are all required.");
        return;
      }

      busy(true);
      fetch(URL_CI, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.text().then(function (t) {
            var parsed = null;
            try { parsed = JSON.parse(t); } catch (e) {}
            return { ok: res.ok, status: res.status, data: parsed, text: t };
          });
        })
        .then(function (r) {
          busy(false);
          if (r.ok && r.data) { clearMsg(); render(r.data); return; }
          var code = r.data && r.data.code ? r.data.code : "HTTP_" + r.status;
          var detail = r.data && r.data.message ? r.data.message : (r.text || "").slice(0, 400);
          if (r.status === 400) {
            show("err", "Invalid request (400)", "<code>" + esc(code) + "</code> &mdash; " + esc(detail));
          } else if (r.status === 404) {
            show("err", "No check-in found (404)", "<code>" + esc(code) + "</code> &mdash; " + esc(detail));
          } else {
            show("err", "Request failed (" + r.status + ")", "<code>" + esc(code) + "</code> &mdash; " + esc(detail));
          }
        })
        .catch(function () {
          busy(false);
          show("warn", "Request blocked",
            "The call never reached the API. Use <b>Preview sample pass</b> to see the layout meanwhile.");
        });
    }

    go.addEventListener("click", send);

    if (demo) {
      demo.addEventListener("click", function () {
        clearMsg();
        show("warn", "Sample pass",
          "Rendered locally from the response shape in the collection. No request was sent.");
        render(SAMPLE);
      });
    }

    var scens = card.querySelectorAll(".jjc-scen");
    for (var i = 0; i < scens.length; i++) {
      scens[i].addEventListener("click", function () {
        ln.value = this.getAttribute("data-ln");
        fn.value = "JJ202";
        dd.value = "2027-10-10";
        send();
      });
    }
  }

  // Fern routes on the client, so the container can appear after load.
  if (document.readyState !== "loading") { init(); }
  document.addEventListener("DOMContentLoaded", init);
  setInterval(init, 600);
})();
