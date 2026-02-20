import React, { useState, useEffect } from "react";
import { Button, Table, Form, Input, message, Modal, Select, Space, Tag } from "antd";
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getAllDevices, createDevice, updateDevice, deleteDevice } from "./api/api";

const { Column } = Table;
const { Option } = Select;

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDevice, setEditingDevice] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch devices
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await getAllDevices();
      setDevices(data);
    } catch (err) {
      message.error(`Failed to fetch devices: ${err.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const showModal = (device = null) => {
    setEditingDevice(device);

    if (device) {
      const configArray = Object.entries(device.config || {}).map(([key, value]) => ({ key, value }));
      form.setFieldsValue({ ...device, configItems: configArray });
    } else {
      form.resetFields();
    }

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingDevice(null);
    setIsModalVisible(false);
  };

  const handleAddDevice = async (values) => {
    try {
      const configObj = {};
      (values.configItems || []).forEach((item) => {
        if (item.key) configObj[item.key] = item.value;
      });

      const deviceData = {
        name: values.name,
        type: values.type,
        config: configObj,
      };

      let updatedDevice;
      if (editingDevice) {
        updatedDevice = await updateDevice(editingDevice.id, deviceData);
        setDevices((prev) =>
          prev.map((d) => (d.id === editingDevice.id ? updatedDevice : d))
        );
        message.success("Device updated!");
        fetchDevices();
      } else {
        updatedDevice = await createDevice(deviceData);
        setDevices((prev) => [...prev, updatedDevice]);
        message.success("Device added!");
        fetchDevices();
      }

      handleCancel();
    } catch (err) {
      message.error(`Failed to save device: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this device?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteDevice(id);
          setDevices((prev) => prev.filter((d) => d.id !== id));
          message.success("Device deleted!");
          fetchDevices();
        } catch (err) {
          message.error(`Failed to delete device: ${err.message}`);
        }
      },
    });
  };

  const renderConfigTags = (config) => {
    if (!config) return null;
    return Object.entries(config).map(([key, value], idx) => (
      <Tag color={typeof value === "number" ? "blue" : "green"} key={idx}>
        {key}: {String(value)}
      </Tag>
    ));
  };

  return (
    <div className="deviceList">
      <h1>Device List</h1>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Add Device
      </Button>

      <Table dataSource={devices} rowKey="id" loading={loading}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Type" dataIndex="type" key="type" />
        <Column
          title="Config"
          key="config"
          render={(text, record) => renderConfigTags(record.config)}
        />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <Space>
              <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
                Edit
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>

      {/* Add/Edit Device Modal */}
      <Modal
        title={editingDevice ? "Edit Device" : "Add Device"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingDevice ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={handleAddDevice}>
          <Form.Item
            name="name"
            label="Device Name"
            rules={[{ required: true, message: "Please enter device name" }]}
          >
            <Input readOnly={editingDevice ? true : false}/>
          </Form.Item>

          <Form.Item
            name="type"
            label="Device Type"
            rules={[{ required: true, message: "Please select device type" }]}
          >
            <Select placeholder="Select type" disabled={editingDevice ? true : false}>
              <Option value="thermostat">Thermostat</Option>
              <Option value="light">Light</Option>
              <Option value="camera">Security Camera</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Device Config Items">
            <Form.List name="configItems">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, "key"]}
                        rules={[{ required: true, message: "Missing key" }]}
                      >
                        <Input placeholder="Key" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[{ required: true, message: "Missing value" }]}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Config Item
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceList;