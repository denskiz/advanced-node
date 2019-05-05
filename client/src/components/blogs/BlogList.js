import React, { useEffect } from 'react';
import map from 'lodash/map';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../../actions';

function BlogList(props) {
  // If you want to run an effect
  // and clean it up only once (on mount and unmount),
  // you can pass an empty array ([]) as a second argument.
  useEffect(() => {
    props.fetchBlogs();
  }, [props.fetchBlogs]);

  function renderBlogs() {
    return map(props.blogs, blog => {
      return (
        <div className="row" key={blog._id}>
          <div className="col s8 offset-s2">
            <div className="card darken-1 horizontal">
              <div className="card-stacked">
                <div className="card-content">
                  <span className="card-title">{blog.title}</span>
                  <p>{blog.content}</p>
                </div>
                <div className="card-action">
                  <Link to={`/blogs/${blog._id}`}>Read</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return <div className="container">{renderBlogs()}</div>;
}

function mapStateToProps({ blogs }) {
  return { blogs };
}

export default connect(
  mapStateToProps,
  { fetchBlogs }
)(BlogList);
