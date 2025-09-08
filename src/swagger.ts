import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
const env = process.env.NODE_ENV || "development";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Raspberry Awards API",
      version: "1.0.0",
      description: "API para consultar vencedores do Golden Raspberry Awards",
    },
  },
  apis: env === "development" ? ["./src/controllers/*.ts"] : ["./dist/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
