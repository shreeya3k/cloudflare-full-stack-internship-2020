
/**
 * CloudFlare 2020 Summer Internship FullStack challenge
 * By Shreeya Kotasthane
 */


const COOKIE = 'variant'
const PROJECT_URL = 'https://cfw-takehome.developers.workers.dev/api/variants'


async function fetchURLResponse(url) {
  const init = {
    method: 'GET',
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    },
  }

  const response = await fetch(url, init)
  const respBody = await response.text()
  return respBody
}


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


async function handleRequest(request) {

  const json = fetchURLResponse(PROJECT_URL)
  const body = await json
  const variants = JSON.parse(body)["variants"];
  const response1 = await fetch(variants[0])
  const response2 = await fetch(variants[1])
  let response;

  const cookie = request.headers.get('cookie')

  if (cookie && cookie.includes(`${COOKIE}=variant1`)) {
    response = response1
  } else if (cookie && cookie.includes(`${COOKIE}= variant2`)) {
    response = response2
  } else {
    let variant_response = Math.random() < 0.5 ? 'variant1' : 'variant2';
    let resp = variant_response === 'variant1' ? response1 : response2
    resp = new Response(resp.body, resp);
    resp.headers.set('Set-Cookie', `${COOKIE}=${variant_response}; path=/`)
    response = resp
  }

  return HTML_REWRITER.transform(response)
}


const HTML_REWRITER  = new HTMLRewriter()
    .on('title', new TitleRewriter())
    .on('h1#title', new TitleHeaderRewriter())
    .on('p#description', new BodyRewriter())
    .on('a#url', new URLRewriter())


class URLRewriter {
    element(el) {
        el.setAttribute('href', 'https://www.linkedin.com/in/shreeyakotasthane/')
        el.setInnerContent('Checkout my LinkedIn profile')
    }
}

class TitleRewriter {
    element(el) {
        el.prepend('This is Shreeya')
    }
}

class BodyRewriter {
    element(el) {
        el.setInnerContent('I am looking for summer internship 2020')
    }
}


class TitleHeaderRewriter {
    element(el) {
        el.prepend('This is Shreeya Kotasthane and this is my version of')
    }
}
