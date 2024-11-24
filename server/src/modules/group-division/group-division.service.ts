import { Injectable } from '@nestjs/common';
import { CreateGroupDivisionDto } from './dto/create-group-division.dto';
import { UpdateGroupDivisionDto } from './dto/update-group-division.dto';

@Injectable()
export class GroupDivisionService {
  create(createGroupDivisionDto: CreateGroupDivisionDto) {
    return 'This action adds a new groupDivision';
  }

  findAll() {
    return `This action returns all groupDivision`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupDivision`;
  }

  update(id: number, updateGroupDivisionDto: UpdateGroupDivisionDto) {
    return `This action updates a #${id} groupDivision`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupDivision`;
  }
}
