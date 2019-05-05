import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function Header({ auth }) {
  function renderContent() {
    switch (auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href={'/auth/google'}>Login With Google</a>
          </li>
        );
      default:
        return [
          <li key="1">
            <Link to="/blogs">My Blogs</Link>
          </li>,
          <li key="2">
            <a href={'/auth/logout'}>Logout</a>
          </li>
        ];
    }
  }

  return (
    <nav>
      <div className="nav-wrapper indigo">
        <div className="container">
          <Link to="/" className="left brand-logo">
            Blogster
          </Link>
          <ul className="right">{renderContent()}</ul>
        </div>
      </div>
    </nav>
  );
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
