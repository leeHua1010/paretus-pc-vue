import request from "~/utils/request";

export default {
  upload(formData) {
    return request.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
