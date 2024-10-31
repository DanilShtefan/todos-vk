import React from "react";
import "antd/dist/reset.css";
import { Layout, Typography } from "antd";
import TodoList from "./components/TodoList";

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header>
        <Title level={2} style={{ color: "#fff" }}>
          MobX Todo List with Infinite Scroll
        </Title>
      </Header>
      <Content style={{ padding: "24px" }}>
        <TodoList />
      </Content>
    </Layout>
  );
};

export default App;
