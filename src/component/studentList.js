import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form } from "antd";
import { formatDistanceToNow } from "date-fns";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const StudentList = () => {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const [dataSource, setDataSource] = useState(
    JSON.parse(
      window.localStorage.getItem("students")
        ? window.localStorage.getItem("students")
        : null
    )
  );
  console.log(dataSource);

  dataSource.students.map((student) => {
    student.createdAt = formatDistanceToNow(new Date(student.createdAt), {
      addSuffix: true,
    });
    return student;
  });

  const [count, setCount] = useState(2);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: "id",
      dataIndex: "id",
      editable: false,
    },
    {
      title: "name",
      dataIndex: "name",
      sorter: true,
      width: "30%",
      editable: true,
    },
    {
      title: "country",
      dataIndex: "country",
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: `courseList`,
    },
    {
      title: "Student Type",
      dataIndex: "type",
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
    },
    {
      title: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  // const handleAdd = () => {
  //   const newData = {

  //   };
  //   setDataSource([...dataSource.students, newData]);
  //   setCount(count + 1);
  // };

  const { Search } = Input;

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <div>
      <Button
        // onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
      <Search
        placeholder="input search text"
        style={{ float: "right", width: "20%" }}
        enterButton
      />
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource.students}
        columns={columns}
      />
    </div>
  );
};

export default StudentList;
