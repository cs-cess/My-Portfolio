import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student CRUD API',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'], // path to files with JSDoc comments
};

const app = express();
app.use(express.json());
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let students = []; // in-memory database
let idCounter = 1;

// CREATE
app.post('/students', (req, res) => {
    /**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice
 *               age:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: Alice
 *               age: 20
 */
  const student = { id: idCounter++, ...req.body };
  students.push(student);
  res.status(201).json(student);
});

// READ ALL
app.get('/students', (req, res) => {
    /**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     responses:
 *       200:
 *         description: List of students
 */
  res.json(students);
});

// READ ONE
app.get('/students/:id', (req, res) => {
    /**
 * @swagger
 * /students:id:
 *   get:
 *     summary: Get all students
 *     responses:
 *       200:
 *         description: List of students
 */
  const student = students.find(s => s.id == req.params.id);
  student ? res.json(student) : res.status(404).send('Not Found');
});

// UPDATE
app.put('/students/:id', (req, res) => {
   /**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               grade:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 */
  const index = students.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    students[index] = { id: parseInt(req.params.id), ...req.body };
    res.json(students[index]);
  } else {
    res.status(404).send('Not Found');
  }
});

// DELETE
app.delete('/students/:id', (req, res) => {
 /**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
  students = students.filter(s => s.id != req.params.id);
  res.sendStatus(204);
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));