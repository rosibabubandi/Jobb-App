import {withRouter, Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props

    history.replace('/login')
  }
  return (
    <nav className="main-header-nav-container">
      <Link className="header-link-element" to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="header-logo"
          alt="website logo"
        />
      </Link>
      <ul className="small-header-ul-container">
        <li>
          <Link to="/" className="header-link-element">
            <AiFillHome className="header-logos" />
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="header-link-element">
            <BsFillBriefcaseFill className="header-logos" />
          </Link>
        </li>
        <li>
          <button
            className="log-out-logo-button"
            type="button"
            onClick={onClickLogout}
          >
            <FiLogOut className="header-logos" />
          </button>
        </li>
      </ul>
      <ul className="medium-header-ul-container">
        <li>
          <Link className="header-link-element" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="header-link-element" to="/jobs">
            Jobs
          </Link>
        </li>
      </ul>
      <div className="log-out-button-container">
        <button
          type="button"
          className="log-out-button"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
