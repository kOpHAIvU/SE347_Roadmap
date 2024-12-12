import { Test, TestingModule } from '@nestjs/testing';
import { GroupDivisionService } from './group-division.service';

describe('GroupDivisionService', () => {
  let service: GroupDivisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupDivisionService],
    }).compile();

    service = module.get<GroupDivisionService>(GroupDivisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
