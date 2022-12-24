import Ajv from 'ajv';

const ajv = new Ajv();
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  items: {
    additionalProperties: false,
    properties: {
      kind: {
        enum: ['commit', 'pr'],
        type: 'string',
      },
      message: {
        type: 'string',
      },
      rule: {
        type: 'string',
      },
    },
    type: 'object',
  },
  type: 'array',
};

export const validateRules = ajv.compile(schema);
