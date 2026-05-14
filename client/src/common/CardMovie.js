import React from "react";
import { LikeOutlined } from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";

const { Meta } = Card;
const { Text } = Typography;

const CardMovie = ({ movie }) => {
  return (
    <Col xs={{ span: 4, offset: 1 }} lg={{ span: 6, offset: 1 }}>
      <Card
        style={{ width: 400, marginBottom: 20 }}
        cover={
          <img
            draggable={false}
            alt="example"
            src={movie.image}
            height={400}
            width={300}
            style={{ objectFit: "cover" }}
          />
        }
        actions={[
          <span key="like" style={{ cursor: "pointer", color: "blue" }}>
            <LikeOutlined /> {movie.likes}
          </span>,
        ]}
      >
        <Meta
          style={{ height: 300 }}
          title={movie.name}
          description={
            <div>
              <div style={{ display: "flex", gap: 10 }}>
                <Text strong>Year of Publication:</Text>
                <Text mark>{movie.yearOfPublication}</Text>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Text strong>Director:</Text>
                <Text mark>{movie.director}</Text>
              </div>

              <br />
              <div style={{ display: "flex", gap: 10 }}>
                <Text strong>Genre:</Text>
                <Text mark>{movie.genre.join(", ")}</Text>
              </div>
              <br />
              <div style={{ display: "flex", gap: 10 }}>
                <Text strong>Rating:</Text>
                <Text type={movie.rating >= 8 ? "success" : "warning"}>
                  {movie.rating.toFixed(1)}
                </Text>
              </div>
              <br />
              <Text> {movie.description}</Text>
            </div>
          }
        />
      </Card>
    </Col>
  );
};
export default CardMovie;
