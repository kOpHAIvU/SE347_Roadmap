import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { GroupDivisionService } from './group-division.service';
import { CreateGroupDivisionDto } from './dto/create-group-division.dto';
import { UpdateGroupDivisionDto } from './dto/update-group-division.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { Role } from '../role/entities/role.entity';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';

@Controller('group-division')
export class GroupDivisionController {
    constructor(private readonly groupDivisionService: GroupDivisionService) {}

    @Post('new')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createGroupDivisionDto: CreateGroupDivisionDto) {
        return await this.groupDivisionService.create(createGroupDivisionDto);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return await this.groupDivisionService.findAll();
    }

    @Get('item/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string) {
        return await this.groupDivisionService.findOneById(+id);
    }

    @Get('user/owner')
    @UseGuards(JwtAuthGuard)
    async findAllGroupOfUser(
        @Req() req: any,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return await this.groupDivisionService.getAllGroupDivisionByUserId(req.user.userId, +page, +limit);
    }

    @Get('team/:teamId')
    @UseGuards(JwtAuthGuard)
    async findAllGroupOfTeam(@Param('teamId') teamId: string) {
        return await this.groupDivisionService.getAllGroupDivisionByTeamId(+teamId);
    }

    // API này về mặt nguyên tắc nghiệp vụ chỉ chỉnh sửa
    // được quyền của người dùng trên timeline
    @Patch('item/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateGroupDivisionDto: UpdateGroupDivisionDto) {
        return await this.groupDivisionService.update(+id, updateGroupDivisionDto);
    }

    @Delete('item/:id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        return await this.groupDivisionService.remove(+id);
    }
}
