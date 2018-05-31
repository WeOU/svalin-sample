function sendToken (token, amount, recipient) {
  const url = 'https://us-central1-chiemgauer-203318.cloudfunctions.net/charge'
    + `?token=${token}&amount=${amount}&recipient=${recipient}`

  const req = new Request(url, <RequestInit>{
    headers: <HeadersInit>{
      'Content-Type': 'application/json',
    },
    method: 'GET',
    mode: 'cors',
  })
  fetch(req)
    .then(() => alert('OK! Expect the tokens to arrive within a few minutes.'))
      //.then(() => (document.querySelector('transactionStatus').classList.toggle('hide')))
    .catch((err) => {
      console.error(err)
      alert('Error sending token request.')
    })
}

function onStripeLoaded (StripeCheckout:any) {
  const handler = StripeCheckout.configure({
    key: 'pk_test_wbX0FkGoH0wY8QajKTihIjw8',
    //image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function (token) {
      const amount = Number((document.querySelector('.buy-amount-dkk') as HTMLSelectElement).value)
      // post this to a cloud function
      const recipient = Number((document.querySelector('userAccount') as HTMLSelectElement).value)
      const debugString = `${token.id} ${amount} ${recipient}`
      console.debug(debugString)
      // document.querySelector('.debug').textContent = debugString
      sendToken(token.id, amount, recipient)
    }
  })

  document.querySelector('.token-button').addEventListener('click', (e) => {
    // Open Checkout with further options:
    const amount = Number((document.querySelector('.buy-amount-dkk') as HTMLSelectElement).value)
      if amount >0 {
          handler.open({
              name: 'Køb ' + amount / 100 + ' Svalin',
              description: '1 Svalin koster 1 Dkk',
              currency: 'Dkk',
              allowRememberMe: false,
              amount,
          })
          e.preventDefault()
      } else {
          alert('Du skal vælge et beløb.'))
      }
  })

  // Close Checkout on page navigation:
  window.addEventListener('popstate', function () {
    handler.close()
  })
}

window.addEventListener('load', () => {
  console.debug("Load!")
  if (!(window as any).StripeCheckout) return
  console.assert(!!(window as any).StripeCheckout, 'StripeCheckout should be defined')
  onStripeLoaded((window as any).StripeCheckout)
})