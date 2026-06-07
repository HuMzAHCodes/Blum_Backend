import { getAnalytics } from "../../services/admin.service.js";
// Gathers dashboard analytical numbers for admins
export const handleGetAnalytics = async (req, res, next) => {
    try {
        const analytics = await getAnalytics();
        res.status(200).json({
            status: "success",
            data: analytics,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=analytics.controller.js.map