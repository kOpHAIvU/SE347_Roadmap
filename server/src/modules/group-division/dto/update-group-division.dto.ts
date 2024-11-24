import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDivisionDto } from './create-group-division.dto';

export class UpdateGroupDivisionDto extends PartialType(CreateGroupDivisionDto) {}
