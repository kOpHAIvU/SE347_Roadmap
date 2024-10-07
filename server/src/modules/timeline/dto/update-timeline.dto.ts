import { PartialType } from '@nestjs/mapped-types';
import { CreateTimelineDto } from './create-timeline.dto';

export class UpdateTimelineDto extends PartialType(CreateTimelineDto) {}
