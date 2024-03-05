import express from "express";
const router = express.Router();

import { createListing } from "../controllers/listing.controller.js";


router.post("/create", createListing);

export default router;