import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

let countdownInterval = null;

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 429) {
            const message = error.response.data.message || "Too many requests";
            const match = message.match(/(\d+)\s*seconds/);

            if (match) {
                let remaining = parseInt(match[1], 10);

                if (countdownInterval) {
                    clearInterval(countdownInterval);
                }

                toast.dismiss("rate-limit");
                toast.error(`Too many requests. Try again in ${remaining} seconds.`, {
                    toastId: "rate-limit",
                    autoClose: false,
                    closeOnClick: false,
                });

                countdownInterval = setInterval(() => {
                    remaining--;
                    if (remaining <= 0) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        toast.dismiss("rate-limit");
                    } else {
                        toast.update("rate-limit", {
                            render: `Too many requests. Try again in ${remaining} seconds.`,
                        });
                    }
                }, 1000);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
