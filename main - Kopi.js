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
        .then(function () { return alert('OK! Expect the tokens to arrive within a few minutes.'); })
        //.then(() => (document.querySelector('transactionStatus').classList.toggle('hide')))
        .catch(function (err) {
        console.error(err);
        alert('Error sending token request.');
    });
}
function onStripeLoaded(StripeCheckout) {
    var handler = StripeCheckout.configure({
        key: 'pk_test_wbX0FkGoH0wY8QajKTihIjw8',
        //image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function (token) {
            var amount = Number(document.querySelector('.buy-amount-dkk').value);
            // post this to a cloud function
            var recipient = Number(document.querySelector('userAccount').value);
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
