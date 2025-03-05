"use client";
import PageTitle from "@/components/page-title";
import { IAppointment } from "@/interfaces";
import { getAppointmentById } from "@/server-actions/appointments";
import { Button, Input, message } from "antd";
import React, { useEffect, useRef } from "react";
import AppointmentReceipt from "./_components/appointment-receipt";
import { useReactToPrint } from "react-to-print";
import { useSearchParams } from "next/navigation";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

function AppointmentConfirmation() {
  const searchParams = useSearchParams();

  const [appointmentId, setAppointmentId] = React.useState(
    searchParams.get("id") || ""
  );
  const [loading, setLoading] = React.useState(false);
  const [appointment, setAppointment] = React.useState<IAppointment | null>(
    null
  );
  const componentRef: any = useRef();

  const handlePrint: any = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleDownload = async () => {
    if (componentRef.current) {
      const imgData = await toPng(componentRef.current);
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (componentRef.current.clientHeight * imgWidth) / componentRef.current.clientWidth;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`appointment_receipt_${appointmentId}.pdf`);
    }
  };
  const getData = async () => {
    try {
      setLoading(true);
      const { data, success } = await getAppointmentById(appointmentId);
      if (success) {
        setAppointment(data);
      } else {
        message.error("No appointment found with the given ID");
      }
    } catch (error) {
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      getData();
    }
  }, [searchParams]);

  return (
    <div className="p-5 flex flex-col items-center gap-7">
      <div className="justify-center flex">
        <PageTitle title="Appointment Confirmation" />
      </div>

      <div className="w-[600px] flex justify-center">
        <div className="flex justify-between gap-5 items-end w-full">
          <div className="w-full">
            <label className="text-sm">Appointment ID</label>
            <Input
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              className="w-full"
            />
          </div>

          <Button type="primary" loading={loading} onClick={getData}>
            Search
          </Button>
        </div>
      </div>

      <div ref={componentRef} className="flex justify-center mt-5">
        <div className="w-[600px]">
          {appointment && <AppointmentReceipt appointment={appointment!} />}
        </div>
      </div>
      {appointment && (
        <div className="flex justify-end gap-5 w-[600px]">
           <Button onClick={handleDownload}>Download</Button>
          <Button type="primary" onClick={handlePrint}>
            Print
          </Button>
        </div>
      )}
    </div>
  );
}

export default AppointmentConfirmation;
