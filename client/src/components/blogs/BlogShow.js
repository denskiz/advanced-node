import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';
import { Link } from 'react-router-dom';
import './BlogShow.css';

function BlogShow(props) {
  useEffect(() => {
    props.fetchBlog(props.match.params._id);
  });

  function renderImage() {
    if (props.blog.imageUrl) {
      return (
        <img
          alt={props.blog.imageUrl}
          src={
            'https://s3-ap-southeast-2.amazonaws.com/advanced-node-de/' +
            props.blog.imageUrl
          }
        />
      );
    }
  }

  if (!props.blog) {
    return '';
  }

  const { title, content } = props.blog;

  return (
    <div className="container">
      <div className="row">
        <div className="col s6">
          <h3>{title}</h3>
        </div>
        <div className="col s6">
          <Link to="/blogs">
            {' '}
            <button className="btn light-blue">Back</button>
          </Link>
        </div>
      </div>
      <div className="row">
        <p>{content}</p>
        {renderImage()}
      </div>
    </div>
  );
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(
  mapStateToProps,
  { fetchBlog }
)(BlogShow);
