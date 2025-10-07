import express from "express";
import cors from "cors";
import fruits from "./routes/post.mjs";
import users from "./routes/user.mjs";
import payments from "./routes/payment.mjs";

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/post", fruits);
app.use("/user", users);
app.use("/payment", payments);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
