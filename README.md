<p align="center" >
    <h1 align="center">Anilist API 🚀</h1>
    <p align="center">Control Your Anilist Programmatically :p</p>
</p>
<p align="center">
<a href="https://github.com/PiyushSuthar/anilist-node-api/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/PiyushSuthar/anilist-node-api?style=for-the-badge"></a>
<a href="https://github.com/PiyushSuthar/anilist-node-api/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/PiyushSuthar/anilist-node-api?style=for-the-badge"></a>
</p>

## ⚠ Warning

> In Development 🔧

I won't recommend using it in production, yet... (Though I'm using 🙄)

## 🔗 Installation

```sh
# npm install anilist-node-api
yarn add anilist-node-api
```

## ⚡️ Usage

I haven't added much methods to it yet.

You can:-

- Authenticate User.
- Get the user's access token.
- Run GraphQl Queries and Mutations.

### 🕺 Authenticating a User.

You'll need to install express (or perhaps `fastify`) first.

```sh
yarn add express # or fastify
```

You'll need this package (Obviously 😆).

```sh
yarn add anilist-node-api
```

Now we can actually write code.

```js
const AniList = require("anilist-node-api").default;
// import Anilist from 'anilist-node-api'
const app = require("express")(); // Express

// Get your ClientId and ClientSecret from your Anilist Account.
const api = new AniList({
  client_id: process.env.CLIENT_ID,
  redirect_url: "Your URL" + "/callback",
  client_secret: process.env.CLIENT_SECRET,
});

app.get("/login", (req, res) => {
  res.redirect(
    // This will generate an OAuth Url and redirect the user.
    api.generateAuthUrl({
      state: "Meet You On Mars!", // This state will be available in /callback. This must be string (Life hack: JSON.stringify())
    })
  );
});

app.get("/callback", async (req, res) => {
  // This is very important... Read more here https://anilist.gitbook.io/anilist-apiv2-docs/overview/oauth/authorization-code-grant
  const code = req.query.code;

  // The state you defined while generating the Auth Url above...
  const state = req.query.state;

  try {
    // This will give you access token and refresh token.
    let {
      access_token,
      refresh_token,
      expires_in,
    } = await api.getAccessTokenFromCode(code);

    // Store them somewhere, Probably database...
    await someDb.store(access_token);

    // Or Just Set it up to the instance...(Security Issues)
    api.setAccessToken(access_token); // This way you can use Auth Queries of the API.

    // Probably some better response here :p
    res.send("OK");
  } catch (err) {
    // Incase Error wants to meet you...
    console.log(err);
    // Decide Yourself :p
    res.sendStatus(500).send("Not OK");
  }
});

// And We have this method too...
/*
 * Check for available queries
 * at:- https://anilist.co/graphiql
 *
 * Don't worry, I'll be adding direct methods too :p
 *
 */
app.get("/user/:id", async (req, res) => {
  // This query dosen't require authentication. but some do require...
  let data = await api.useGraphQL(
    `
query FavUser($id: Int!){
  User(id: $id){
    id
    name
  }
}
`,
    {
      id: 947500,
    }
  );

  res.json(data);
});

// And finally let's give express ears to listen...
app.listen(4000); // My prefered port :p
```

The methods used above are the only methods available right now.

These are more than enough to use it with graphql queries and mutations. Though I'll add direct methods for each query and mutations too...

## 🤟 Contributions

Contributions, issues and feature requests are welcome!

if you feel that something is missing, feel free to create an [Issue](https://github.com/PiyushSuthar/anilist-node-api/issues).

## ❤ Support

Almost all the project I make are Open Source. To keep me supporting, consider supporting.

Do ⭐ this Project.

Well, I'll meet you on Mars.

`Shinzou Wo Sasageyo ❤`

---

Made with ❤ and TypeScript.
