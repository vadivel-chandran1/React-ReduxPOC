import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as courseActions from "../../Redux/actions/courseActions";
//import { bindActionCreators } from "redux";

class CoursesPage extends React.Component {
  //

  state = {
    course: {
      title: "",
    },
  };

  handleChange = (event) => {
    debugger;
    const course = { ...this.state.course, title: event.target.value };
    this.setState({ course });
  };

  handleAddCourseSubmit = (event) => {
    debugger;
    event.preventDefault();
    // const course = {
    //   ...this.state.course,
    //   title: document.getElementById("idAddCourse").value,
    // };
    // this.setState({ course });
    this.props.createCourse(this.state.course);
  };

  render() {
    return (
      <div>
        <h2>Courses</h2>
        <form id="idAddCourseForm" onSubmit={this.handleAddCourseSubmit}>
          <input type="text" id="idAddCourse" onBlur={this.handleChange} />
          <input type="submit" id="idAddCourseSubmit" />
          {/* {<div>{this.state.course.title}</div>} */}
          {this.props.courses.map((course) => (
            <div key={course.title}>{course.title}</div>
          ))}
        </form>
      </div>
    );
  }
}
CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  createCourse: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    courses: state.courses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //actions: bindActionCreators(courseActions, dispatch),
    createCourse: (course) => dispatch(courseActions.createCourse(course)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
