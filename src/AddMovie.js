import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Typography,
  Image,
  DatePicker,
  Select,
} from "antd";
import { PlusOutlined, PictureOutlined } from "@ant-design/icons";
import { fetchMovieInfo } from "./api/fetchMovieInfo";
import { normalizeGenre } from "./helper/normalizeGenre";
const { Meta } = Card;
const { Text } = Typography;
const { TextArea } = Input;

const ADD_MOVIE = gql`
  mutation AddMovie($movie: moviesInsertInput!) {
    insertIntomoviesCollection(objects: [$movie]) {
      records {
        id
        name
        year_of_publication
        is_in_theaters
        image
        description
        director
        genre
        rating
        likes
      }
    }
  }
`;

const AddMovie = () => {
  const [open, setOpen] = useState(false);
  const [formInstance] = Form.useForm();
  const [addMovie] = useMutation(ADD_MOVIE, {
    refetchQueries: ["GetMovies"],
  });
  const [form, setForm] = useState({
    movieName: null,
    imageLink: null,
    yearOfPublication: null,
    movieDirector: null,
    movieDescription: null,
    movieGenre: null,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setForm({ movieName: "", imageLink: "" });
  };
  const onFinish = async (values) => {
    const fetchMovie = await fetchMovieInfo(values.movieName);

    await addMovie({
      variables: {
        movie: {
          name: values.movieName,
          image: values.imageLink || fetchMovie.Poster,
          year_of_publication: values.yearOfPublication
            ? new Date(values.yearOfPublication).getFullYear()
            : Number(fetchMovie.Year),
          director: values.movieDirector || fetchMovie.Director,
          genre:
            normalizeGenre(values.movieGenre).length > 0
              ? normalizeGenre(values.movieGenre)
              : normalizeGenre(fetchMovie.Genre),
          description: values.movieDescription || fetchMovie.Plot,
          rating:
            fetchMovie.imdbRating && fetchMovie.imdbRating !== "N/A"
              ? fetchMovie.imdbRating
              : "0",
        },
      },
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleOk = () => {
    formInstance.submit();

    setConfirmLoading(true);
    setTimeout(() => {
      formInstance.resetFields();

      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Movie
      </Button>
      <Modal
        title="Add a New Movie"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Add Movie"
        cancelText="Cancel"
        width={720}
      >
        <Form
          name="basic"
          layout="vertical"
          style={{ marginTop: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={formInstance}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Movie details
              </Text>
              <div style={{ marginTop: 12 }}>
                <Form.Item
                  label="Movie name"
                  name="movieName"
                  rules={[{ required: true, message: "Please input name" }]}
                >
                  <Input
                    size="large"
                    placeholder="e.g. Inception"
                    value={form.movieName}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        movieName: e.target.value,
                      });
                    }}
                  />
                </Form.Item>

                <Form.Item label="Image link" name="imageLink">
                  <Input
                    size="large"
                    prefix={<PictureOutlined style={{ color: "#9ca3af" }} />}
                    placeholder="https://example.com/poster.jpg"
                    value={form.imageLink}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        imageLink: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="year of Publication" name="yearOfPublication">
                  <DatePicker
                    max={new Date().getFullYear()}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        yearOfPublication: e,
                      });
                    }}
                    picker="year"
                  />
                </Form.Item>
                <Form.Item label="Director" name="movieDirector">
                  <Input
                    size="large"
                    placeholder="e.g. Christopher Nolan"
                    value={form.movieDirector}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        movieDirector: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item label="Movie Genre" name="movieGenre">
                  <Select
                    mode="tags"
                    size="large"
                    placeholder="e.g. Animation, Thriller"
                    tokenSeparators={[","]}
                  />
                </Form.Item>
                <Form.Item label="Description" name="movieDescription">
                  <TextArea
                    rows={4}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        movieDescription: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div style={{ width: 280 }}>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Live preview
              </Text>
              <Card
                style={{
                  width: 280,
                  marginTop: 12,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                styles={{ body: { padding: 16 } }}
                cover={
                  <div
                    style={{
                      width: "100%",
                      height: 320,
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={form.imageLink || "error"}
                      alt="poster preview"
                      width="100%"
                      height={320}
                      style={{ objectFit: "cover" }}
                      preview={false}
                      fallback="data:image/png;base64,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"
                    />
                  </div>
                }
              >
                <Meta
                  title={
                    <Text
                      strong
                      style={{
                        fontSize: 16,
                        color: form.movieName ? undefined : "#9ca3af",
                      }}
                    >
                      {form.movieName || "Movie title"}
                    </Text>
                  }
                  description={
                    <div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Text strong>Year of Publication:</Text>
                        <Text mark>
                          {form.yearOfPublication &&
                            new Date(form.yearOfPublication).getFullYear()}
                        </Text>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Text strong>Director:</Text>
                        <Text mark>{form.movieDirector}</Text>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Text strong>Genre:</Text>
                        <Text mark>{form.movieGenre}</Text>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Text strong>Description:</Text>
                      </div>
                      <Text mark>{form.movieDescription}</Text>
                    </div>
                  }
                />
              </Card>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default AddMovie;
