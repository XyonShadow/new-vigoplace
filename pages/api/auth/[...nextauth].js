import axios from "axios"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions = {
  session: {
    strategy: "jwt",
  },
//   session: {
//     jwt: true,
//     maxAge: 30 * 24 * 60 * 60
// },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      type: "credentials",
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {},
      // credentials: {
      //   username: { label: "username", type: "text", placeholder: "jsmith" },
      //   password: {  label: "password", type: "password" }
      // },
      async authorize(credentials, req) {
        console.log(credentials, 'credentials pro max')
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        // const res = await fetch("https://vigoplace.com/server/api/admin/auth/login", {
        //   method: 'POST',
        //   body:{
        //     "username": "administrator",
        //     "password": "Administration100@"
        // },
        //   // body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" }
        // })
        console.log("***********")
        console.log(credentials.username)
        console.log(credentials.password)
        const res = await axios.post('https://vigoplace.com/server/api/admin/auth/login', 
        // credentials
        {
          "username": credentials.username,
          "password": credentials.password
        }
        )
        console.log(res, "respond to me...")

        const user = await res.data

        console.log(user, "user to me...")
        // console.log(res.data, "respond to me...")

        // If no error and we have user data, return it
        if (user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/',
    error: '/'
    // signIn: '/login'
  },
  callbacks: {
    async jwt({token, user}) {
  //  console.log(params, "param me")
   if (user) {
    token.user = user.data
  }
  return token
    },
    async session({session, token, user}) {
      // console.log({session, token, user}, 'from session')
      // console.log({ session, token, user })
      // Send properties to the client, like an access_token from a provider.
      session.user = token.user
      return session
    }
  },
}
export default NextAuth(authOptions)
