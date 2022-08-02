import { get } from "../../../apiService";
import { user } from "../../../App";
import { Calendar, Badge } from "antd";

const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

const getListData = (value) => {

}

const ClassSchedule = () => {
    get(`class/schedule?userId=${user.userId}`).then((response) => console.log(response.data))
    const monthCellRender = (value) => {
        const num = getMonthData(value);
        return num ? (
          <div className="notes-month">
            <section>{num}</section>
            <span>Backlog number</span>
          </div>
        ) : null;
      };
    
      const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
          <ul className="events">
            {listData.map((item) => (
              <li key={item.content}>
                <Badge status={item.type} text={item.content} />
              </li>
            ))}
          </ul>
        );
      };
    
      return <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />;
}
export default ClassSchedule;