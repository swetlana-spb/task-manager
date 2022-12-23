import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getAllTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }

  //   return tasks;
  // }

  async getTasks(filterDTO: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO);
  }


  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`The task with ID ${id} not found.`);
    }
    return found;
  }

  createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO);
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`The task with ID ${id} not found.`);
    }
  }

  async updateTaskStatusById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
