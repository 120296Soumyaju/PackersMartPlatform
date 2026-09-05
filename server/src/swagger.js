const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PackersMart Platform REST API',
      version: '1.0.0',
      description: 'Interactive OpenAPI 3.0 / Swagger documentation for PackersMart lead capture, 6-digit OTP verification, lead quality scoring (Hot/Warm/Cold), logistics company matching engine, and administrative dashboard statistics REST APIs.',
      contact: {
        name: 'PackersMart Engineering Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server'
      }
    ],
    components: {
      schemas: {
        LeadInput: {
          type: 'object',
          required: ['customerName', 'mobile', 'pickupCity', 'destinationCity', 'serviceType', 'movingDate'],
          properties: {
            customerName: { type: 'string', example: 'Rahul Sharma' },
            mobile: { type: 'string', example: '+91 9812345678' },
            email: { type: 'string', example: 'rahul.sharma@example.com' },
            pickupCity: { type: 'string', example: 'Mumbai' },
            destinationCity: { type: 'string', example: 'Bangalore' },
            serviceType: { type: 'string', example: 'Household Relocation (2BHK)' },
            movingDate: { type: 'string', example: '2026-09-25' },
            additionalRequirements: { type: 'string', example: 'Wooden crating for TV required.' }
          }
        },
        Lead: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '7e060972-62cf-4da9-ad6d-ba44c29902f7' },
            customerName: { type: 'string', example: 'Rahul Sharma' },
            mobile: { type: 'string', example: '+91 9812345678' },
            email: { type: 'string', example: 'rahul.sharma@example.com' },
            pickupCity: { type: 'string', example: 'Mumbai' },
            destinationCity: { type: 'string', example: 'Bangalore' },
            serviceType: { type: 'string', example: 'Household Relocation (2BHK)' },
            movingDate: { type: 'string', example: '2026-09-25' },
            additionalRequirements: { type: 'string', example: 'Wooden crating for TV required.' },
            status: { type: 'string', example: 'Verified', enum: ['Pending', 'Verified', 'Fake', 'Duplicate', 'Re-attempt'] },
            leadScore: { type: 'integer', example: 85 },
            leadQuality: { type: 'string', example: 'Hot', enum: ['Hot', 'Warm', 'Cold'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        OtpVerifyInput: {
          type: 'object',
          required: ['otp'],
          properties: {
            otp: { type: 'string', example: '123456' }
          }
        },
        StatusUpdateInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', example: 'Verified', enum: ['Pending', 'Verified', 'Fake', 'Duplicate', 'Re-attempt'] },
            notes: { type: 'string', example: 'Customer phone confirmed.' }
          }
        },
        Company: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'c10294-883a-442b' },
            companyName: { type: 'string', example: 'Agarwal Express Packers & Movers' },
            mobile: { type: 'string', example: '+91 9876543210' },
            email: { type: 'string', example: 'contact@agarwalexpress.in' },
            coverage: { type: 'string', example: '["Mumbai","Delhi NCR","Bangalore"]' },
            serviceTypes: { type: 'string', example: '["Household Relocation (2BHK)","Office Shifting"]' },
            rating: { type: 'number', example: 4.8 },
            reviewCount: { type: 'integer', example: 342 },
            status: { type: 'string', example: 'Active', enum: ['Active', 'Inactive'] },
            fleetSize: { type: 'integer', example: 45 }
          }
        },
        LeadCompanyMatch: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'm90214-4112' },
            leadId: { type: 'string', example: '7e060972-62cf-4da9-ad6d-ba44c29902f7' },
            companyId: { type: 'string', example: 'c10294-883a-442b' },
            matchScore: { type: 'integer', example: 95 },
            matchReasons: { type: 'string', example: '["Direct coverage","Top-rated"]' },
            notificationStatus: { type: 'string', example: 'Recommended' },
            company: { $ref: '#/components/schemas/Company' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/app.js']
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Endpoint to serve JSON OpenAPI spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📖 Swagger Interactive API Docs available at http://localhost:5000/api-docs');
}

module.exports = setupSwagger;
