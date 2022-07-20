import { useEffect, useState } from "react";
import { Col, Row, Skeleton, Divider, Select, List, Avatar } from "antd";
import { get } from "../apiService";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserOutlined } from "@ant-design/icons";

const Title = styled.h2`
  font-size: 30px;
`;

const Message = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("all");
  useEffect(() => {
    get(
      type === "all"
        ? `message?limit=${10 * page}&page=1`
        : `message?limit=${10 * page}&page=1&type=${type}`
    ).then((response) => {
      setData(response.data);
      setMessage(response.data.messages);
    });
  }, [page, type]);

  const showTime = (data, item) => {
    if (data.indexOf(item) === 0) {
      return <h2>{item.createdAt.split(" ")[0]}</h2>;
    }
    if (
      data[data.indexOf(item) - 1].createdAt.split(" ")[0] !==
      item.createdAt.split(" ")[0]
    ) {
      return <h2>{item.createdAt.split(" ")[0]}</h2>;
    }
  };
  return (
    <div>
      <Row>
        <Col span={8}>
          <Title>Recent Messages</Title>
        </Col>
        <Col span={8}></Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Select
            defaultValue="all"
            onChange={(value) => {
              setType(value);
            }}
            style={{width: "100px", textAlign: "center"}}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="notification">Notification</Select.Option>
            <Select.Option value="message">Message</Select.Option>
          </Select>
        </Col>
      </Row>
      <div
        id="scrollableMessage"
        style={{ margin: "10px", overflow: "auto", height: "70vh" }}
      >
        <InfiniteScroll
          dataLength={message?.length}
          next={() => {
            setPage(page + 1);
          }}
          hasMore={message?.length < data?.total}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableMessage"
        >
          <List
            dataSource={data?.messages}
            itemLayout="vertical"
            renderItem={(item) => (
              <List.Item key={item.id}>
                {showTime(data?.messages, item)}
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.from.nickname}
                  description={item.content}
                />
                <div>{item.createdAt}</div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Message;
