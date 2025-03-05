"use server";

import AppointmentModel from "@/models/appointment-model";
import DoctorModel from "@/models/doctor-model";
import PatientModel from "@/models/patient-model";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const getDashboardData = async () => {
  try {
    const todayDate = dayjs().utc().format("YYYY-MM-DD");
    console.log("Today's Date:", todayDate); // Debugging Log

    const [
      todayAppointmentsCount,
      allAppointmentsCount,
      allDoctorsCount,
      allPatientsCount,
      todayAppointmentsData,
    ] = await Promise.all([
      AppointmentModel.countDocuments({ date: todayDate, status: "approved" }),
      AppointmentModel.countDocuments(),
      DoctorModel.countDocuments(),
      PatientModel.countDocuments(),
      AppointmentModel.find({ date: todayDate, status: "approved" })
        .populate("doctor")
        .populate("patient"),
    ]);

    return {
      success: true,
      data: {
        todayAppointmentsCount,
        allAppointmentsCount,
        allDoctorsCount,
        allPatientsCount,
        todayAppointmentsData: JSON.parse(
          JSON.stringify(todayAppointmentsData)
        ),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getReportsData = async ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  try {
    const appointments = await AppointmentModel.find({
      date: { $gte: fromDate, $lte: toDate },
    })
      .populate("doctor")
      .populate("patient");

    return {
      success: true,
      data: {
        appointmentsCount: appointments.length,
        feeCollected: appointments.reduce((acc, curr) => acc + curr.fee, 0),
        appointmentsData: JSON.parse(JSON.stringify(appointments)),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
