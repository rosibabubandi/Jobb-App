import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})

    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitLogin = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const loginApiUrl = 'https://apis.ccbp.in/login'

    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const loginResponse = await fetch(loginApiUrl, options)
    const loginData = await loginResponse.json()

    if (loginResponse.ok) {
      this.onLoginSuccess(loginData.jwt_token)
    } else {
      this.onLoginFailure(loginData.error_msg)
    }
  }

  getLoginForm = () => {
    const {username, password, showSubmitError, errorMsg} = this.state

    return (
      <form className="login-form-container" onSubmit={this.onSubmitLogin}>
        <div className="login-website-logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="login-website-logo"
            alt="website logo"
          />
        </div>
        <label htmlFor="username" className="login-form-label-element">
          USERNAME
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={this.onChangeUsername}
          className="input-filed"
          placeholder="Username"
        />
        <label htmlFor="password" className="login-form-label-element">
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={this.onChangePassword}
          className="input-filed"
          placeholder="Password"
        />
        <button type="submit" className="login-button">
          Login
        </button>
        {showSubmitError && <p className="error-msg-text">{errorMsg}</p>}
      </form>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return <div className="login-main-container">{this.getLoginForm()}</div>
  }
}

export default LoginForm
