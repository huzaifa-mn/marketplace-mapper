import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Marketplace Mapper API",
            version: "1.0.0",
            description:
                "API for managing marketplace templates, seller files, and column mappings between them.",
            contact: {
                name: "API Support",
                email: "your.email@example.com",
            },
        },
        servers: [
            {
                url: "http://localhost:4000", // or whatever your backend port is
                description: "Development server",
            },
        ],
        components: {
            schemas: {
                SellerFile: {
                    type: "object",
                    required: ["id", "fileName", "columns", "createdAt"],
                    properties: {
                        id: { type: "integer", description: "Seller file ID", example: 1 },
                        fileName: {
                            type: "string",
                            description: "Original filename",
                            example: "products.csv",
                        },
                        columns: {
                            type: "array",
                            items: { type: "string" },
                            description: "Detected header columns from the file",
                            example: ["sku", "name", "price"],
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Upload timestamp",
                        },
                    },
                },
                MarketplaceTemplate: {
                    type: "object",
                    required: ["id", "name", "marketplace", "attributes"],
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: {
                            type: "string",
                            example: "Amazon US Clothing",
                        },
                        marketplace: {
                            type: "string",
                            example: "AMAZON_US",
                        },
                        attributes: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 101 },
                                    name: { type: "string", example: "Title" },
                                    required: { type: "boolean", example: true },
                                },
                            },
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                MappingItem: {
                    type: "object",
                    required: ["marketplaceAttributeId", "sellerColumnName"],
                    properties: {
                        marketplaceAttributeId: {
                            type: "integer",
                            example: 101,
                        },
                        sellerColumnName: {
                            type: "string",
                            example: "name",
                        },
                    },
                },
                Mapping: {
                    type: "object",
                    required: ["id", "marketplaceTemplateId", "sellerFileId", "items"],
                    properties: {
                        id: { type: "integer", example: 1 },
                        marketplaceTemplateId: {
                            type: "integer",
                            example: 1,
                        },
                        sellerFileId: {
                            type: "integer",
                            example: 10,
                        },
                        items: {
                            type: "array",
                            items: { $ref: "#/components/schemas/MappingItem" },
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                CreateMappingRequest: {
                    type: "object",
                    required: ["marketplaceTemplateId", "sellerFileId", "items"],
                    properties: {
                        marketplaceTemplateId: { type: "integer", example: 1 },
                        sellerFileId: { type: "integer", example: 10 },
                        items: {
                            type: "array",
                            items: { $ref: "#/components/schemas/MappingItem" },
                        },
                    },
                },
                PaginatedResult_SellerFile: {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            items: { $ref: "#/components/schemas/SellerFile" },
                        },
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        total: { type: "integer", example: 42 },
                        totalPages: { type: "integer", example: 5 },
                    },
                },
                PaginatedResult_MarketplaceTemplate: {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            items: { $ref: "#/components/schemas/MarketplaceTemplate" },
                        },
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        total: { type: "integer", example: 15 },
                        totalPages: { type: "integer", example: 2 },
                    },
                },
                PaginatedResult_Mapping: {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Mapping" },
                        },
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        total: { type: "integer", example: 8 },
                        totalPages: { type: "integer", example: 1 },
                    },
                },
                ApiError: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Something went wrong",
                        },
                        code: {
                            type: "string",
                            example: "INTERNAL_ERROR",
                        },
                    },
                },
            },
            parameters: {
                Page: {
                    name: "page",
                    in: "query",
                    schema: {
                        type: "integer",
                        minimum: 1,
                        default: 1,
                    },
                    description: "Page number for pagination",
                },
                Limit: {
                    name: "limit",
                    in: "query",
                    schema: {
                        type: "integer",
                        minimum: 1,
                        maximum: 100,
                        default: 10,
                    },
                    description: "Items per page",
                },
            },
        },
    },
    // Make sure this matches where your route files with @openapi/@swagger JSDoc live
    apis: ["./src/features/**/*.routes.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
    app.use(
        "/api/docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, {
            explorer: true,
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "Marketplace Mapper API Documentation",
        }),
    );

    app.get("/api/docs.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(specs);
    });
};
