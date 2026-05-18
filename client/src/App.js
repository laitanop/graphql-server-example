import React from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { UserList } from "./UserList";
import {
  Avatar,
  Badge,
  Divider,
  Layout,
  Space,
  Tag,
  Tooltip,
  Typography,
  Tabs,
} from "antd";
import {
  ApiOutlined,
  BellOutlined,
  GithubOutlined,
  PlayCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./App.css";
import MovieList from "./MovieList";

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL || "http://localhost:4000/graphql",
  }),
  cache: new InMemoryCache(),
});

function App() {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: (
        <span className="app-tab-label">
          <PlayCircleOutlined />
          Movies
        </span>
      ),
      children: <MovieList />,
    },
    {
      key: "2",
      label: (
        <span className="app-tab-label">
          <UserOutlined />
          Users
        </span>
      ),
      children: <UserList />,
    },
  ];
  return (
    <ApolloProvider client={client}>
      <Layout className="app-layout">
        <Header className="app-header">
          <div className="app-header-inner">
            <Space align="center" size={12} className="app-brand">
              <div className="app-brand-icon" aria-hidden>
                <ApiOutlined />
              </div>
              <div className="app-brand-text">
                <Title level={5} className="app-header-title">
                  GraphQL Directory
                </Title>
                <Text className="app-header-subtitle">
                  Movies & users · Apollo Client
                </Text>
              </div>
            </Space>

            <Space align="center" size={4} className="app-nav">
              <Tag color="geekblue" bordered={false} className="app-nav-tag">
                v1.0
              </Tag>
              <Divider type="vertical" className="app-nav-divider" />
              <Tooltip title="View on GitHub">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-nav-icon-btn"
                  aria-label="View on GitHub"
                >
                  <GithubOutlined />
                </a>
              </Tooltip>
              <Tooltip title="Notifications">
                <Badge count={3} size="small">
                  <button
                    type="button"
                    className="app-nav-icon-btn"
                    aria-label="Notifications, 3 unread"
                  >
                    <BellOutlined />
                  </button>
                </Badge>
              </Tooltip>
              <Divider type="vertical" className="app-nav-divider" />
              <Tooltip title="Signed in as admin">
                <Avatar
                  size={34}
                  src="https://api.dicebear.com/7.x/miniavs/svg?seed=admin"
                  className="app-nav-avatar"
                  alt=""
                />
              </Tooltip>
            </Space>
          </div>
        </Header>
        <Content className="app-content">
          <div className="app-content-inner">
            <Tabs
              defaultActiveKey="1"
              items={items}
              onChange={onChange}
              className="app-main-tabs"
              size="large"
            />
          </div>
        </Content>
        <Footer className="app-footer">
          GraphQL Directory © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </ApolloProvider>
  );
}

export default App;
