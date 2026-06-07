import { getAdminProducts } from "../../services/admin.service.js";
// Returns full catalog list including active/inactive product listings
export const handleGetAdminProducts = async (req, res, next) => {
    try {
        const products = await getAdminProducts();
        res.status(200).json({
            status: "success",
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=products.controller.js.map