import React, { useState, useEffect } from "react";
import {
  Divider,
  Col,
  Row,
  Skeleton,
  List,
  Avatar,
  Tabs,
  message as Message,
  Button,
} from "antd";
import { get, put } from "../apiService";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import messageSSE from "./messageSSE";
import { useMessage } from "../reducer";
import { user } from "../App";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const MessageDropdown = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState([]);
  const [page, setPage] = useState(1);
  const [tabKey, setTabKey] = useState("notification");
  const { msgStore, dispatch } = useMessage();
  const evtSource = messageSSE();
  useEffect(() => {
    get(`message?limit=10&page=${page}&type=${tabKey}`).then((response) => {
      setData(response.data);
      setMessage((message) => [...message, ...response.data.messages]);
    });
  }, [page, tabKey, msgStore]);

  useEffect(() => {
    evtSource.addEventListener("message", (event) => {
      let data = event.data;
      data = JSON.parse(data);
      if (data?.type === "message") {
        setPage(1);
      }
    });

    return () => {
      evtSource.close();
    };
  }, [evtSource]);

  return (
    <div style={{ marginTop: "5px" }}>
      <Tabs
        defaultActiveKey="notification"
        onChange={(key) => {
          if (key !== tabKey) {
            setPage(1);
            setMessage([]);
          }
          setTabKey(key);
        }}
        centered="true"
      >
        <TabPane
          tab={`notification (${msgStore.notification})`}
          key="notification"
        ></TabPane>
        <TabPane tab={`message (${msgStore.message})`} key="message"></TabPane>
      </Tabs>
      <div id="scrollableDrop" style={{ overflow: "auto", height: "35vh" }}>
        <InfiniteScroll
          dataLength={message?.length}
          next={() => {
            setPage(page + 1);
          }}
          height="35vh"
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
            dataSource={message}
            itemLayout="vertical"
            renderItem={(item) => (
              <List.Item
                key={item.nickname}
                style={{
                  marginLeft: "20px",
                  marginRight: "20px",
                  opacity: item.status === 1 ? 0.4 : 1,
                }}
                onClick={() => {
                  if (item.status === 0) {
                    put("message", {
                      ids: [item.id],
                      status: 1,
                    }).then((response) => {
                      if (response.data) {
                        item.status = 1;
                        dispatch({
                          type: "DEC",
                          payload: { type: item.type, count: 1 },
                        });
                      }
                    });
                  }
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.from.nickname}
                  description={item.content}
                />
                <div style={{ marginLeft: "48px" }}>
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
            height: "48px"
          }}
        >
            <Button
            style={{border: "none", marginTop: "8px" }}
              onClick={() => {
                const items = message.filter((item) => item.status === 0);
                if (items.length !== 0) {
                  put("message", {
                    ids: items.map((item) => item.id),
                    status: 1,
                  }).then((response) => {
                    if (response.data) {
                      items.forEach((item) => {
                        item.status = 1;
                      });
                      dispatch({
                        type: "DEC",
                        payload: { type: tabKey, count: items.length },
                      });
                    }
                  });
                } else {
                  Message.success(`All ${tabKey}s are read!`);
                }
              }}
            >
              Mark All as Read
            </Button>
        </Col>
        <Col
          span={12}
          style={{
            textAlign: "center",
          }}
        >
            <Button style={{border: "none", marginTop: "8px"}}><Link to={`/dashboard/${user.role}/messages`}>View History</Link></Button>
        </Col>
      </Row>
    </div>
  );
};

export default MessageDropdown;
