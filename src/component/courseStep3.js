import { Result, Button} from "antd";
import { Link } from "react-router-dom";

const ThirdPage = (props = null) => {
  return (
    <Result
      status="success"
      title="The Course Successfully Created!"
      extra={[
        <Button type="primary" key="goCourse">
          <Link to={`/dashboard/manager/courses/${props.courseId}`}>
            Go Course
          </Link>
        </Button>,
        <Button key="addCourse">
          <Link to="/dashboard/manager/courses/add-course">Create Again</Link>
        </Button>,
      ]}
      style={{ marginTop: "150px" }}
    />
  );
};

export default ThirdPage;
