import React, { useState, useEffect } from "react";
import { Divider, Col, Row, Skeleton, List, Avatar, Tabs } from "antd";
import { get } from "../apiService";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";

const { TabPane } = Tabs;

const MessageDropdown = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState([]);
  const [page, setPage] = useState(1);
  const [tabKey, setTabKey] = useState("notification");
  useEffect(() => {
    get(`message?limit=${10 * page}&page=1&type=${tabKey}`).then((response) => {
      setData(response.data);
      setMessage(response.data.messages);
    });
  }, [page, tabKey]);

  return (
    <div style={{ marginTop: "5px" }}>
      <Tabs
        defaultActiveKey="notification"
        onChange={(key) => {
          setTabKey(key);
        }}
        centered="true"
      >
        <TabPane tab="notification" key="notification"></TabPane>
        <TabPane tab="message" key="message"></TabPane>
      </Tabs>
      <div
        id="scrollableDrop"
        style={{ marginLeft: "30px", overflow: "auto", height: "35vh" }}
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
          scrollableTarget="scrollableDrop"
        >
          <List
            dataSource={data?.messages}
            itemLayout="vertical"
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.from.nickname}
                  description={item.content}
                />
                <div style={{marginLeft: "48px"}}>
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
      <Row
        style={{
          borderTop: "1px solid rgb(240, 240, 240)",
          borderBottom: "1px solid rgb(240, 240, 240)",
        }}
      >
        <Col
          span={12}
          style={{
            textAlign: "center",
            borderRight: "1px solid rgb(240, 240, 240)",
          }}
        >
          <div style={{ marginTop: "10px" }}>
            <p>Mark All as Read</p>
          </div>
        </Col>
        <Col
          span={12}
          style={{
            textAlign: "center",
          }}
        >
          <div style={{ marginTop: "10px" }}>
            <p>View History</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MessageDropdown;
