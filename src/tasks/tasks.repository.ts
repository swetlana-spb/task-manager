import { CreateTaskDTO } from './dto/create-task.dto';
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDTO: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        }, filters: ${JSON.stringify(filterDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    try {
      await this.save(task);
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create a new task for user ${
          user.username
        }, params: ${JSON.stringify(createTaskDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
