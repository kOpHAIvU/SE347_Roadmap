import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapController } from './roadmap.controller';
import { RoadmapService } from './roadmap.service';

const mockRoadmapRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('RoadmapController', () => {
  let controller: RoadmapController;
  let service: RoadmapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoadmapController],
      providers: [RoadmapService],
    }).compile();

    controller = module.get<RoadmapController>(RoadmapController);
  });

  describe('Create new roadmap', () => {
    it('Should create new roadmap successfully', async () => {

    })

    it('Should create new roadmap failed because of server error',
      async () => {
        
    })
  })
});
