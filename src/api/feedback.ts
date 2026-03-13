import { api } from "./api";

export const submitFeedback = (message: string) => {
    return api.post("/feedback", { message });
};

export const getAllFeedback = () => {
    return api.get("/feedback");
};
