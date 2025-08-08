import { toast, ToastOptions, TypeOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

export function toastSuccess(message: string, options?: ToastOptions) {
  return toast.success(message, { ...defaultOptions, ...options });
}

export function toastError(message: string, options?: ToastOptions) {
  return toast.error(message, { ...defaultOptions, ...options });
}

export function toastInfo(message: string, options?: ToastOptions) {
  return toast.info(message, { ...defaultOptions, ...options });
}

export function toastWarning(message: string, options?: ToastOptions) {
  return toast.warning(message, { ...defaultOptions, ...options });
}

export function toastDefault(message: string, options?: ToastOptions) {
  return toast(message, { ...defaultOptions, ...options });
}
