import { Test, TestingModule } from '@nestjs/testing';
import { GroupDivisionController } from './group-division.controller';
import { GroupDivisionService } from './group-division.service';

describe('GroupDivisionController', () => {
  let controller: GroupDivisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupDivisionController],
      providers: [GroupDivisionService],
    }).compile();

    controller = module.get<GroupDivisionController>(GroupDivisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
