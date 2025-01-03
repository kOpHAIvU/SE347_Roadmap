import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { Roles } from '../role/common/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post('new')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() createTeamDto: CreateTeamDto, @UploadedFile() file?: Express.Multer.File) {
        return this.teamService.create(createTeamDto, file);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    async findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
        return await this.teamService.findAll(page, limit);
    }

    @Get('item/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: string) {
        return await this.teamService.findOneById(+id);
    }

    @Patch('item/:id')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id', ParseIntPipe) id: string,
        @Body() updateTeamDto: UpdateTeamDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return await this.teamService.update(+id, updateTeamDto, file);
    }

    @Delete('item/:id')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: string, @UploadedFile() file?: Express.Multer.File) {
        return await this.teamService.remove(+id, file);
    }
}
