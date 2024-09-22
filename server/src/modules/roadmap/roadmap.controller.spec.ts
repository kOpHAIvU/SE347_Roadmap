import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapController } from './roadmap.controller';
import { RoadmapService } from './roadmap.service';

describe('RoadmapController', () => {
  let controller: RoadmapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoadmapController],
      providers: [RoadmapService],
    }).compile();

    controller = module.get<RoadmapController>(RoadmapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
