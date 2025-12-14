import { Router } from "express";
import marketplaceRouter from "../../features/marketplaces/marketplaces.routes";
import sellerFileRouter from "../../features/seller-files/seller-files.routes";
import mappingRouter from "../../features/mappings/mappings.routes";

const router = Router();

router.use("/marketplace-templates", marketplaceRouter);
router.use("/seller-files", sellerFileRouter);
router.use("/mappings", mappingRouter);

export default router;
