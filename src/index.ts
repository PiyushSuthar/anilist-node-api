import axios, { AxiosInstance } from 'axios'

interface Options {
    client_id: string | number
    redirect_url: string
    client_secret: string
}

// TODO: Add some JsDoc comments.
/**
 * @name Anilist
 */
class Anilist {

    private api: AxiosInstance
    private token: string | null
    // Constructor
    constructor(private options?: Options) {
        this.token = null
        this.api = axios.create({
            baseURL: "https://graphql.anilist.co",
            headers: this.token && {
                "Authorization": `bearer ${this.token}`
            }
        })
    }

    /**
     * Set access token to the instance.
     * @param token The accessToken of the User.
     */
    setAccessToken(token: string): void {
        this.token = token
    }

    generateAuthUrl({ state }: {
        /**
         * Data you would like to share to the callback.
         */
        state: string
    }): string {
        let redirect_url = encodeURI(`${this.options?.redirect_url}${state && `&state=${state}`}`)

        let authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${this.options?.client_id}&redirect_uri=${redirect_url}&response_type=code`

        return authUrl
    }

    async getAccessTokenFromCode(code: string): Promise<{
        access_token: string
        refresh_token: string
        token_type: 'Bearer',
        expires_in: number
    }> {
        const res = await axios.post('https://anilist.co/api/v2/oauth/token', {
            'grant_type': 'authorization_code',
            'client_id': this.options?.client_id,
            'client_secret': this.options?.client_secret,
            'redirect_uri': this.options?.redirect_url,
            'code': code,
        })
        const data = await res.data

        return data
    }

    /**
     * Use custom Graphql queries.
     * 
     * ```js
     * const anilist = new Anilist(token)
     * 
     * anilist.useGraphQl(`
     * query MyQuery($id: Int!){
     *  someQuery(id: $id){
     *  name
     * }
     * }
     * `, {
     *  id: 123
     * })
     * ```
     * @param query GraphQL query.
     * @param variables Variables.
     */
    async useGraphQL(query: string, variables?: any) {
        const data = await this.api.post("/", {
            query,
            variables
        })

        return data.data
    }

}

export default Anilist