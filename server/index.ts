import bodyParser from 'body-parser';
import express, { Express, Request, Response , Application, NextFunction } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import { HttpError } from 'express-openapi-validator/dist/framework/types';

import { paths, components } from '../openapi/types/openapi/specs/todo'

const todos: Array<components['schemas']['ToDo']> = [];
const app: Application = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use(
    OpenApiValidator.middleware({
      apiSpec: '../resources/Todo/schema.yaml',
      validateRequests: true,
      validateResponses: true,
    }),
  );

app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    if (!res.headersSent) {
        // send the error response
        res.status(err.status || 500)
            .send({ error_code: err.status, message: err.message });
    }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.post('/todos', (req: Request, res: Response) => {
    const todoInput: components['schemas']['ToDoInput'] = req.body;
    const newTodo: components['schemas']['ToDo'] = {
        ...todoInput,
        id: crypto.randomUUID(),
        completed: false
    }
    todos.push(newTodo);
    res.status(201).send();
});

app.get('/todos', (req: Request, res: Response) => {
    res.status(200).json(todos);
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});