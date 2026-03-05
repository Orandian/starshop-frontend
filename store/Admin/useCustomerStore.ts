import { create } from "zustand";
import { apiRoutes } from "@/lib/api/api.route";
import { CustomerDetail } from "@/types/customers";
import React, { createRef } from "react";
import { renderToString } from "react-dom/server";
import { FCPlanMaster } from "@/types/admin/fcplan.type";
import { Invoice } from "@/types/admin/invoice.type";
import { OrderDetail } from "@/types/orders/index";

interface CustomerState {
  userType: string;
  userDetail: CustomerDetail;
  filteredPlans: FCPlanMaster[];
  setUserType: (type: string) => void;
  setUserDetail: (detail: CustomerDetail) => void;
  setFilteredPlans: (plans: FCPlanMaster[]) => void;
  getUserType: () => string;
  getUserDetail: () => CustomerDetail;
  getFilteredPlans: () => FCPlanMaster[];
  downloadInvoice: (customerId: string, invoiceDate: string) => Promise<void>;
  downloadInvoiceReceipt: (
    customerId: string,
    invoiceData: Invoice,
    orderItems: OrderDetail,
    userType: string, // value: "general" or "fc"
    fromSource?: string, // value: "user" or empty ( to iddentify from user site or admin site)
  ) => Promise<void>;
  downloadContract1: (
    userDetail: CustomerDetail,
    filteredPlans: FCPlanMaster[],
  ) => Promise<void>;
  downloadContract2: (userDetail: CustomerDetail) => Promise<void>;
  downloadContract3: (userDetail: CustomerDetail) => Promise<void>;
  isDownloading: boolean;
  isContract1Downloading: boolean;
  isContract2Downloading: boolean;
  isContract3Downloading: boolean;
  downloadError: string | null;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  userType: "",
  userDetail: {} as CustomerDetail,
  filteredPlans: [],
  setUserType: (type: string) => set({ userType: type }),
  setUserDetail: (detail: CustomerDetail) => set({ userDetail: detail }),
  setFilteredPlans: (plans: FCPlanMaster[]) => set({ filteredPlans: plans }),
  getUserType: () => get().userType,
  getUserDetail: () => get().userDetail,
  getFilteredPlans: () => get().filteredPlans,
  isDownloading: false,
  isContract1Downloading: false,
  isContract2Downloading: false,
  isContract3Downloading: false,
  downloadError: null,

  /**
   * Download invoice (Bonus receiptアカウントボーナス・管理金)
   * @param customerId customer id
   * @param userDetail user detail
   * @author Phway
   */
  downloadInvoice: async (customerId: string, invoiceDate: string) => {
    set({ isDownloading: true, downloadError: null });
    let userDetail: CustomerDetail = {} as CustomerDetail;
    if (customerId && get().getUserDetail().userId === customerId) {
      userDetail = get().getUserDetail();
    } else {
      //fetch user detail
      const response =
        await apiRoutes.admin.customer.getCustomerById(customerId);
      if (response?.data) {
        userDetail = response.data;
      }
    }
    try {
      // Fetch invoice data
      const response = await apiRoutes.admin.customer.getInvoiceByCustomerId(
        customerId,
        invoiceDate,
      );

      if (response?.data) {
        // Dynamic import to avoid circular dependencies
        const { generatePDF } =
          await import("@/utils/admin/customers-invoices/generatePDF");
        await generatePDF(response.data, userDetail, invoiceDate);
      }
    } catch (error) {
      console.error("Failed to download invoice:", error);
      set({
        downloadError:
          error instanceof Error ? error.message : "Download failed",
      });
    } finally {
      set({ isDownloading: false });
    }
  },

  /**
   * Download invoice (請求書・領収書管理 and FC invoice)
   * @param customerId customer id
   * @param userDetail user detail
   * @author Phway
   */
  downloadInvoiceReceipt: async (
    customerId: string,
    invoiceData: Invoice,
    OrderDetail: OrderDetail,
    userType: string,
    fromSource?: string,
  ) => {
    set({ isDownloading: true, downloadError: null });
    let userDetail: CustomerDetail = {} as CustomerDetail;
    if (customerId && get().getUserDetail().userId === customerId) {
      userDetail = get().getUserDetail();
    } else {
      //fetch user detail
      const response =
        fromSource === "user"
          ? await apiRoutes.user.getUserById(customerId)
          : await apiRoutes.admin.customer.getCustomerById(customerId);
      if (response?.data) {
        userDetail = response.data;
      }
    }
    try {
      //confirm userType with userDetai's type
      const userTypeName =
        userDetail?.user_type === 2
          ? "fc"
          : userDetail?.user_type === 3
            ? "general"
            : "";
      if (userTypeName !== userType) {
        throw new Error("User type does not match");
      }

      // Dynamic import to avoid circular dependencies
      if (userType === "general") {
        const { generateReceiptPDF } =
          await import("@/utils/admin/customers-invoices/generateReceiptPDF");
        await generateReceiptPDF(invoiceData, userDetail, OrderDetail);
      } else {
        const { generateInvoicePDF } =
          await import("@/utils/admin/customers-invoices/generateInvoicePDF");
        await generateInvoicePDF(invoiceData, userDetail, OrderDetail);
      }
    } catch (error) {
      console.error("Failed to download invoice:", error);
      set({
        downloadError:
          error instanceof Error ? error.message : "ダウンロードに失敗しました",
      });
    } finally {
      set({ isDownloading: false });
    }
  },
  /**
   * Download contract (Customer Contract - アカウント Application)
   * @param userDetail user detail
   * @author Phway
   */
  downloadContract1: async (
    userDetail: CustomerDetail,
    filteredPlans: FCPlanMaster[],
  ) => {
    set({ isContract1Downloading: true, downloadError: null });
    try {
      const { default: ContractFormPdf } =
        await import("@/components/admin/pdf_contract/ContractFormPdf");

      const { generatePDF } = await import("@/utils/fc/pdfGenerate");

      const pdfRef = createRef<HTMLDivElement>();

      // ✅ NO JSX → safe in .ts file
      const element = React.createElement(ContractFormPdf, {
        ref: pdfRef,
        userDetail,
        filteredPlans,
      });

      const htmlString = renderToString(element);

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlString;

      await generatePDF(
        tempDiv,
        `継続供給販売申込書-${userDetail?.usernameKana}`,
      );
    } catch (error) {
      console.error("Failed to download contract:", error);

      set({
        downloadError:
          error instanceof Error ? error.message : "Contract download failed",
      });
    } finally {
      set({ isContract1Downloading: false });
    }
  },
  /**
   * Download contract (Customer Contract - アカウント-Referrer)
   * @param userDetail user detail
   * @author Phway
   */
  downloadContract2: async (userDetail: CustomerDetail) => {
    set({ isContract2Downloading: true, downloadError: null });
    try {
      const { default: ContractForm2Pdf } =
        await import("@/components/admin/pdf_contract/ContractForm2Pdf");

      const { generatePDF } = await import("@/utils/fc/pdfGenerate");

      const pdfRef = createRef<HTMLDivElement>();

      // ✅ NO JSX → safe in .ts file
      const element = React.createElement(ContractForm2Pdf, {
        ref: pdfRef,
        userDetail,
      });

      const htmlString = renderToString(element);

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlString;

      await generatePDF(tempDiv, `紹介制度同意書-${userDetail?.usernameKana}`);
    } catch (error) {
      console.error("Failed to download contract:", error);

      set({
        downloadError:
          error instanceof Error ? error.message : "Contract download failed",
      });
    } finally {
      set({ isContract2Downloading: false });
    }
  },
  /**
   * Download contract (Customer Contract - アカウント- )
   * @param userDetail user detail
   * @author Phway
   */
  downloadContract3: async (userDetail: CustomerDetail) => {
    set({ isContract3Downloading: true, downloadError: null });
    try {
      const { default: ContractForm3Pdf } =
        await import("@/components/admin/pdf_contract/ContractForm3Pdf");

      const { generatePDF } = await import("@/utils/fc/pdfGenerate");

      const pdfRef = createRef<HTMLDivElement>();

      // ✅ NO JSX → safe in .ts file
      const element = React.createElement(ContractForm3Pdf, {
        ref: pdfRef,
        userDetail,
      });

      const htmlString = renderToString(element);

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlString;

      await generatePDF(
        tempDiv,
        `個人情報取扱い同意書-${userDetail?.usernameKana}`,
      );
    } catch (error) {
      console.error("Failed to download contract:", error);

      set({
        downloadError:
          error instanceof Error ? error.message : "Contract download failed",
      });
    } finally {
      set({ isContract3Downloading: false });
    }
  },
}));
