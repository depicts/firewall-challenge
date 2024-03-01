import needle from 'needle'
import { solveChallenge } from './utils.js'

const website = "<redacted>"

!(async () => {
    console.log("Getting homepage...")

    const response = await needle('get', website + '/', {
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9',
            'referer': website + '/',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        }
    })

    if (response.statusCode === 429) {
        console.log("Got firewall challenge on homepage! Solving challenge...")

        const body = response.body
        const challengeToken = /(?<=_vcrct=")(.*?)(?=")/g.exec(body)[0]
        const solution = await solveChallenge(challengeToken)

        const solutionResponse = await needle('post', website + '/.well-known/vercel/security/request-challenge', null, {
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'referer': website + '/',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'x-vercel-challenge-solution': solution,
                'x-vercel-challenge-token': challengeToken,
            }
        })

        console.log("Getting homepage again after solving challenge...")

        const bypassResponse = await needle('get', website + '/', {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'en-US,en;q=0.9',
                'referer': website + '/',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'cookie': Object.entries(solutionResponse.cookies).map(([name, value]) => `${name}=${value}`).join(";")
            }
        })

        console.log(`Got status code ${bypassResponse.statusCode} for homepage...`)
    }
})()

