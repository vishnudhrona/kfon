import { createBaseApi } from "@/utils/apiUtils";

export const baseApi = createBaseApi({
    tagTypes: ["User", "Auth", "Post"]
});