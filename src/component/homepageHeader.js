import { Affix, Dropdown, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { user } from "../App";

const SignIn = styled.li`
  @media screen and (min-width: 700px) {
    position: fixed;
    right: 6em;
  }
`;

export const HomepageHeader = () => {
  const path = window.location.pathname
  const isEvents = path.includes("events");
  const isGallery = path.includes("gallery");
  const isLogin = path.includes("login");
  const isSignUp = path.includes("signup");
  const foreDark = isLogin || isSignUp;
  const dark = "dark-header";
  const light = "light-header";

  return (
    <>
      <Affix
        offsetTop={0}
        onChange={(fixed) => {
          if (foreDark) {
            return;
          }

          const ele = document.getElementById("header");

          if (!fixed) {
            ele.className = ele.className.replace(dark, light);
          } else {
            ele.className = ele.className.replace(light, dark);
          }
        }}
      >
        <header id="header" className={foreDark ? dark : light}>
          <link to="/style.css" type="text/css" rel="stylesheet"></link>
          <div className="container">
            <Link to="/">
              <span id="logo" />
            </Link>

            <Dropdown
              trigger={["click"]}
              className="menu-trigger"
              overlay={
                <Menu
                  style={{ fontFamily: "BebasNeue" }}
                  selectedKeys={[path.slice(1)]}
                >
                  <Menu.Item key="events">
                    <Link to="/events">Courses</Link>
                  </Menu.Item>
                  <Menu.Item key="events2">
                    <Link to="/events">Events</Link>
                  </Menu.Item>
                  <Menu.Item key="gallery">
                    <Link to="/gallery">Students</Link>
                  </Menu.Item>
                  <Menu.Item key="gallery2">
                    <Link to="/gallery">Teachers</Link>
                  </Menu.Item>
                  <Menu.Item key="login">
                    <SignIn className={isLogin ? "current" : ""}>
                      {user ? (
                        <Link to={`/dashboard/${user.role}`}>Dashboard</Link>
                      ) : (
                        <Link to="/login">Sign in</Link>
                      )}
                    </SignIn>
                  </Menu.Item>
                </Menu>
              }
            >
              <span></span>
            </Dropdown>

            <nav id="menu">
              <ul>
                <li className={isEvents ? "current" : ""}>
                  <Link to="/events">Courses</Link>
                </li>
                <li>
                  <Link to="/events">Events</Link>
                </li>
              </ul>
              <ul>
                <li className={isGallery ? "current" : ""}>
                  <Link to="/gallery">Students</Link>
                </li>
                <li>
                  <Link to="/gallery">Teachers</Link>
                </li>
                <SignIn className={isLogin ? "current" : ""}>
                  {user ? (
                    <Link to={`/dashboard/${user.role}`}>Dashboard</Link>
                  ) : (
                    <Link to="/login">Sign in</Link>
                  )}
                </SignIn>
              </ul>
            </nav>
          </div>
        </header>
      </Affix>
    </>
  );
};
