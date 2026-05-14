import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

import { Alert, Spin, Typography, Input, Space } from "antd";
import CardComponent from "./common/CardComponent";

const { Title, Text } = Typography;

const QUERY_ALL_USERS = gql`
  query Users {
    users {
      id
      name
      nationality
      username
    }
  }
`;
const QUERY_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      name
      nationality
      username
    }
  }
`;

export const UserList = () => {
  const [id, setId] = useState(null);
  const { loading, error, data } = useQuery(QUERY_ALL_USERS);
  const { data: userData } = useQuery(QUERY_USER, { variables: { id } });

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}
      >
        <Spin size="large" tip="Loading users..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load users"
        description={error.message}
        showIcon
        style={{ maxWidth: 500, margin: "40px auto" }}
      />
    );
  }

  const users = data?.users ?? [];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#1a1f3c" }}>
          Members
        </Title>
        <Text type="secondary">
          {users.length} user{users.length !== 1 ? "s" : ""} found
        </Text>
      </div>
      <div style={{ marginBottom: 20 }}>
        <Space.Compact>
          <Input
            type="number"
            placeholder="Enter user id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </Space.Compact>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {userData ? (
          <CardComponent key={userData?.user?.id} user={userData?.user} />
        ) : (
          users.map((user) => <CardComponent key={user.id} user={user} />)
        )}
      </div>
    </div>
  );
};
