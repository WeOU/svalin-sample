var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function sendToken(token, amount, recipient) {
    var url = 'https://us-central1-chiemgauer-203318.cloudfunctions.net/charge'
        + ("?token=" + token + "&amount=" + amount + "&recipient=" + recipient);
    var req = new Request(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET',
        mode: 'cors',
    });
    fetch(req)
        //.then(() => alert('OK! Expect the tokens to arrive within a few minutes.'))
        .then(function () { return (document.querySelector('transactionStatus').classList.toggle('.hide')); })
        .catch(function (err) {
        console.error(err);
        alert('Error sending token request.');
    });
}
function getAmountCents(selector) {
    return Math.round(document.querySelector(selector).valueAsNumber * 100);
}
function linkCurrencies(selector1, selector2, exchangeRate) {
    var el1 = document.querySelector(selector1);
    var el2 = document.querySelector(selector2);
    console.assert((el1 && el2), "should've found..", el1, el2);
    el1.addEventListener('keyup', function () {
        el2.valueAsNumber = toPrecision(el1.valueAsNumber * exchangeRate, 2);
    });
    el2.addEventListener('keyup', function () {
        el1.valueAsNumber = toPrecision(el2.valueAsNumber / exchangeRate, 2);
    });
}
function withdraw() {
    return __awaiter(this, void 0, void 0, function () {
        var amount, recipient, url, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    amount = getAmountCents(".sell-amount-cmg");
                    recipient = "";
                    url = 'https://us-central1-chiemgauer-203318.cloudfunctions.net/withdraw'
                        + ("?amount=" + amount + "&recipient=" + recipient);
                    req = new Request(url, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'GET',
                        mode: 'cors',
                    });
                    return [4 /*yield*/, fetch(req)];
                case 1:
                    res = _a.sent();
                    alert('Withdrawal registered');
                    return [2 /*return*/];
            }
        });
    });
}
function toPrecision(value, numDecimals) {
    if (numDecimals === void 0) { numDecimals = 2; }
    return Math.round(value * Math.pow(10, numDecimals)) / Math.pow(10, numDecimals);
}
window.addEventListener('load', function () {
    linkCurrencies('.buy-amount-token', '.buy-amount-dkk', 1);
    linkCurrencies('.sell-amount-token', '.sell-amount-dkk', 0.95);
});
function onStripeLoaded(StripeCheckout) {
    var handler = StripeCheckout.configure({
        key: 'pk_test_wbX0FkGoH0wY8QajKTihIjw8',
        //image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function (token) {
            var amount = getAmountCents('.buy-amount-token');
            // post this to a cloud function
            var recipient = document.querySelector('.token-recipient').getAttribute('value');
            var debugString = token.id + " " + amount + " " + recipient;
            console.debug(debugString);
            // document.querySelector('.debug').textContent = debugString
            sendToken(token.id, amount, recipient);
        }
    });
    document.querySelector('.token-button').addEventListener('click', function (e) {
        // Open Checkout with further options:
        var amount = Number(document.querySelector('.buy-amount-dkk').value);
        if (amount > 0) {
            handler.open({
                name: 'Køb ' + amount / 100 + ' Svalin',
                description: '1 Svalin koster 1 Dkk',
                currency: 'Dkk',
                allowRememberMe: false,
                amount: amount,
            });
            e.preventDefault();
        }
        else {
            alert('Du skal vælge et beløb.');
        }
    });
}
// Close Checkout on page navigation:
window.addEventListener('popstate', function () {
    handler.close();
});
window.addEventListener('load', function () {
    console.debug("Load!");
    if (!window.StripeCheckout)
        return;
    console.assert(!!window.StripeCheckout, 'StripeCheckout should be defined');
    onStripeLoaded(window.StripeCheckout);
});
