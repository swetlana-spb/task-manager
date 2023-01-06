import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './tasks-status.enum';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
  createTask: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  username: 'Test',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

const mockTask = {
  title: 'Test title',
  description: 'Test descr',
  id: 'someId',
  status: TaskStatus.OPEN,
};

describe('TasksService', () => {
  let tasksServise: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksServise = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      const resultValue = 'someValue';
      tasksRepository.getTasks.mockResolvedValue(resultValue);
      const result = await tasksServise.getTasks(null, mockUser);
      expect(result).toEqual(resultValue);
    });

    describe('getTaskById', () => {
      it('calls TasksRepository.findOneBy and returns the result', async () => {
        await tasksRepository.findOneBy.mockResolvedValue(mockTask);
        const result = await tasksServise.getTaskById('someId', mockUser);
        expect(result).toEqual(mockTask);
      });

      it('calls TasksRepository.findOneBy and raises the exception', async () => {
        tasksRepository.findOneBy.mockResolvedValue(null);
        expect(tasksServise.getTaskById('someId', mockUser)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('deleteTaskById', () => {
      it('calls TaskRepository.delete and returns void', async () => {
        await tasksRepository.delete.mockResolvedValue(mockTask);
        const result = await tasksServise.deleteTaskById('someId', mockUser);
        expect(result).toEqual(undefined);
        expect(tasksRepository.delete).toHaveBeenCalled();
      });
      it('calls TaskRepository.delete and raises the exception', async () => {
        tasksRepository.delete.mockResolvedValue(null);
        expect(tasksServise.getTaskById('someId', mockUser)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('createTask', () => {
      it('calls TaskRepository.createTask and returns task', async () => {
        tasksRepository.createTask.mockResolvedValue(mockTask);
        const result = await tasksServise.createTask(mockTask, mockUser);
        expect(result).toEqual(mockTask);
      });
    });

    describe('updateTaskStatusById', () => {
      it('calls TaskRepository.findOneBy and returns task with new status', async () => {
        await tasksRepository.findOneBy.mockResolvedValue(mockTask);
        const changedTask = {
          title: 'Test title',
          description: 'Test descr',
          id: 'someId',
          status: TaskStatus.IN_PROGRESS,
        };
        await tasksRepository.save.mockResolvedValue(changedTask);
        const result = await tasksServise.updateTaskStatusById(
          'someId',
          TaskStatus.IN_PROGRESS,
          mockUser,
        );
        expect(result).toEqual(changedTask);
      });
    });
  });
});
