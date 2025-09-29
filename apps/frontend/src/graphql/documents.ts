export const LOGIN_MUTATION = `
  mutation Login($password: String!) {
    login(password: $password) {
      token
    }
  }
`
