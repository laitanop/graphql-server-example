import React from "react";
import {
  GlobalOutlined,
  HeartOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Tag, Tooltip, Typography } from "antd";

const { Text } = Typography;
const { Meta } = Card;

const nationalityColor = {
  US: "blue",
  UK: "geekblue",
  CA: "cyan",
  AU: "green",
  DE: "purple",
  FR: "magenta",
  JP: "orange",
  BR: "lime",
};

const CardComponent = ({ user = {} }) => {
  const { id = 1, name = "Unknown", username = "", nationality = "" } = user;
  const tagColor = nationalityColor[nationality] ?? "default";

  return (
    <Card
      style={{
        width: 280,
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid #e8eaf6",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      hoverable
      actions={[
        <Tooltip title="Like" key="heart">
          <HeartOutlined style={{ color: "#ff6b6b" }} />
        </Tooltip>,
        <Tooltip title="Share" key="share">
          <ShareAltOutlined style={{ color: "#4ecdc4" }} />
        </Tooltip>,
        <Tooltip title="View profile" key="profile">
          <UserOutlined style={{ color: "#7c83d4" }} />
        </Tooltip>,
      ]}
    >
      <Meta
        avatar={
          <Avatar
            src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${id}`}
            size={48}
            style={{ border: "2px solid #e8eaf6" }}
          />
        }
        title={
          <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1f3c" }}>
            {name} + {id}
          </span>
        }
        description={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginTop: 4,
            }}
          >
            <Text type="secondary" style={{ fontSize: 13 }}>
              @{username}
            </Text>
            {nationality && (
              <Tag
                icon={<GlobalOutlined />}
                color={tagColor}
                style={{ width: "fit-content", fontSize: 12 }}
              >
                {nationality}
              </Tag>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default CardComponent;
