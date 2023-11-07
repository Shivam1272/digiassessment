import React, { useEffect, useState } from "react";
import { Table, Button, Input, Form, Modal } from "antd";

const DynamicTable = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    location: "",
    cgpa: "",
  });
  const [editingStudent, setEditingStudent] = useState(null); // Added state for currently edited student
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error(error));
  }, [students]);

  const columns = [
    {
      title: "Row Num",
      dataIndex: "rowNum",
      key: "rowNum",
      render: (text, record, index) => index + 1,
      sorter: (a, b) => a.rowNum - b.rowNum,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "CGPA",
      dataIndex: "cgpa",
      key: "cgpa",
      sorter: (a, b) => a.cgpa - b.cgpa,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    setIsEditing(false);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (isEditing) {
        console.log(`Updating student: ${values.name}`);
      } else {
        fetch("http://localhost:5000/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.student) {
              setStudents([...students, data.student]);
              setIsModalVisible(false);
            } else {
              console.error(data.message);
            }
          })
          .catch((error) => console.error(error));
      }
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = (student) => {
    form.setFieldsValue(student);
    setEditingStudent(student);
    setIsModalVisible(true);
    form.validateFields().then((values) => {
      fetch(`http://localhost:5000/api/students/${student._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.student) {
            // Update the local state with the updated student data
            setStudents((prevStudents) =>
              prevStudents.map((student) =>
                student._id === data.student._id ? data.student : student
              )
            );
            setIsModalVisible(false);
          } else {
            console.error(data.message);
          }
        })
        .catch((error) => console.error(error));
    });
    setIsModalVisible(false);
  };

  const handleDelete = (studentId) => {
    console.log("hello000000", studentId);
    fetch(`http://localhost:5000/api/students/${studentId}`, {
      method: "DELETE",
    })
      .then(() => {
        setStudents(students.filter((student) => student._id !== studentId));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Table dataSource={students} columns={columns} rowKey="rowNum" />

      <Modal
        title={isEditing ? "Edit Student" : "Add Student"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter the location" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="CGPA"
            name="cgpa"
            rules={[{ required: true, message: "Please enter the CGPA" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={showModal}>
        Add Student
      </Button>
    </div>
  );
};

export default DynamicTable;
