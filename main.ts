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

function getAmountCents (selector:string):number {
  return Math.round( (document.querySelector(selector) as HTMLInputElement).valueAsNumber * 100)
}

function linkCurrencies(selector1:string, selector2:string, exchangeRate:number) {
  const el1 = document.querySelector(selector1) as HTMLInputElement
  const el2 = document.querySelector(selector2) as HTMLInputElement
  console.assert((el1 && el2) as any, `should've found..`,el1, el2)
  el1.addEventListener('keyup', () => {
      el2.valueAsNumber = toPrecision(el1.valueAsNumber * exchangeRate, 2)
  })
  el2.addEventListener('keyup', () => {
      el1.valueAsNumber = toPrecision(el2.valueAsNumber / exchangeRate, 2)
  })
}

async function withdraw() {
  const amount = getAmountCents(".sell-amount-cmg")
  const recipient = ""
  const url = 'https://us-central1-chiemgauer-203318.cloudfunctions.net/withdraw'
    + `?amount=${amount}&recipient=${recipient}`

  const req = new Request(url, <RequestInit>{
    headers: <HeadersInit>{
      'Content-Type': 'application/json',
    },
    method: 'GET',
    mode: 'cors',
  })
  const res = await fetch(req)
  alert('Withdrawal registered')
}

function toPrecision(value:number, numDecimals = 2):number {
  return Math.round( value * 10 ** numDecimals ) / 10 ** numDecimals
}

window.addEventListener('load', () => {
  linkCurrencies('.buy-amount-token','.buy-amount-dkk', 1)
  linkCurrencies('.sell-amount-token','.sell-amount-dkk', 0.95)
})

function onStripeLoaded (StripeCheckout:any) {
  const handler = StripeCheckout.configure({
    key: 'pk_test_wbX0FkGoH0wY8QajKTihIjw8',
    //image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function (token) {
      const amount = Number((document.querySelector('.buy-amount-dkk') as HTMLSelectElement).value)
      // post this to a cloud function
      const recipient = web3.eth.defaultAccount
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