"use server";

import { IPatient } from "@/interfaces";
import PatientModel from "@/models/patient-model";

export const getAllPatients = async (searchParams: {
  name: string;
  phone: string;
  gender: string;
}) => {
  try {
    let filtersToApply: any = {};
    if (searchParams.name) {
      filtersToApply.name = { $regex: searchParams.name, $options: "i" };
    }

    if (searchParams.phone) {
      filtersToApply.phone = { $regex: searchParams.phone, $options: "i" };
    }

    if (searchParams.gender) {
      filtersToApply.gender = searchParams.gender;
    }
    const patients = await PatientModel.find(filtersToApply).sort({
      createdAt: -1,
    });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(patients)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deletePatient = async (id: string) => {
  try {
    await PatientModel.findByIdAndDelete(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
export const updatePatient = async (id: string, updatedData: Partial<IPatient>) => {
  try {
    await PatientModel.findByIdAndUpdate(id, updatedData, { new: true });
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};