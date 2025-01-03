import { Router } from "express";

import {
  loginHandler,
  logoutHandler,
  signupHanlder,
} from "../controllers/auth";

const router = Router();

router.post("/signup", signupHanlder);
router.post("/login", loginHandler);
router.get("/logout", logoutHandler);

export const auth = router;
