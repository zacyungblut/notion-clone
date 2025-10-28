import express, { Application, Request, Response } from "express";
import cors from "cors";
import pageRoutes from "./routes/pageRoutes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", pageRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Notion Clone API",
    endpoints: {
      getAllPages: "GET /api/pages",
      getPageById: "GET /api/pages/:id",
      createPage: "POST /api/pages",
      updatePage: "PUT /api/pages/:id",
      deletePage: "DELETE /api/pages/:id",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
