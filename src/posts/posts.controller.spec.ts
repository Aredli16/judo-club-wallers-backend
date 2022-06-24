import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a post array', async () => {
    const result = [
      {
        id: expect.any(String),
        title: expect.any(String),
        subtitle: expect.any(String),
        content: expect.any(String),
        author: expect.any(String),
        date_posted: expect.any(Number),
      },
    ];

    jest.spyOn(service, 'findAll').mockImplementation(async () => result);
    expect(await controller.findAll()).toBe(result);
  });

  it('should return a one post', async () => {
    const result = {
      id: expect.any(String),
      title: expect.any(String),
      subtitle: expect.any(String),
      content: expect.any(String),
      author: expect.any(String),
      date_posted: expect.any(Number),
    };

    jest.spyOn(service, 'findOne').mockImplementation(async () => result);
    expect(await controller.findOne(expect.any(String))).toBe(result);
  });
});
