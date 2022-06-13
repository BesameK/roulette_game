import { Body, Controller, Delete, Get, Post, Req, Session } from '@nestjs/common';
import { BetService } from './bet.service';
import { BetInfoDto } from './dto/betInfo.dto';

@Controller('bet')
export class BetController {
    constructor(private BetService: BetService) { }

    @Post('/create')
    async create(@Req() req) {
        return await this.BetService.create(req)
    }

    @Post('/spin')
    async spin(@Session() session, @Body() betInfo: BetInfoDto) {
        return await this.BetService.spin(session,betInfo.betInfo)
    }

    @Delete('/end')
    async deleteSession(@Session() session){
        return await this.BetService.deletSession(session)
    }
}
