"use client";
import { IPatient } from "@/interfaces";
import { Button, message, Modal, Table, Form, Select, Input } from "antd";
import { Trash2, Pen, List } from "lucide-react";
import React, { useState } from "react";
import PatientAppointmentModal from "./patient-appointments-modal";
import { deletePatient, updatePatient } from "@/server-actions/patients";

interface PatientsTableProps {
  patients: IPatient[];
}

function PatientsTable({ patients }: PatientsTableProps) {
  const [showPatientAppointmentModal, setShowPatientAppointmentModal] =
    useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [form] = Form.useForm();
  const [showPatients, setShowPatients] = useState<IPatient[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      onOk: async () => {
        const { success } = await deletePatient(id);
        if (success) {
          message.success("Patient deleted successfully");
          setShowPatients((prev) => prev.filter((p) => p._id !== id)); // حذف از UI
        } else {
          message.error("Failed to delete patient");
        }
      },
    });
  };
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const { success } = await updatePatient(selectedPatient!._id, values);
      if (success) {
        message.success("Patient updated successfully");
        setShowPatients((prev) =>
          prev.map((p) =>
            p._id === selectedPatient!._id ? { ...p, ...values } : p
          )
        );
        setShowEditModal(false);
      } else {
        message.error("Failed to update patient");
      }
    } catch (error) {
      message.error("Please fill out the form correctly.");
    }
  };
  const handleEdit = (patient: IPatient) => {
    setSelectedPatient(patient);
    form.setFieldsValue(patient);
    setShowEditModal(true);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, record: any) => (
        <div className="flex gap-5">
          <Button size="small" onClick={() => handleEdit(record)}>
            <Pen size={14} />
          </Button>

          <Button
            size="small"
            onClick={() => {
              setSelectedPatient(record);
              setShowPatientAppointmentModal(true);
            }}
          >
            <List size={14} /> View Appointments
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Table
        dataSource={patients}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
      <Modal
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onOk={handleUpdate}
        title="Edit Patient"
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Phone is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Age is required" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Gender is required" }]}
          >
            <Select
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {selectedPatient && showPatientAppointmentModal && (
        <PatientAppointmentModal
          selectedPatient={selectedPatient}
          showPatientAppointmentModal={showPatientAppointmentModal}
          setShowPatientAppointmentModal={setShowPatientAppointmentModal}
        />
      )}
    </div>
  );
}

export default PatientsTable;
