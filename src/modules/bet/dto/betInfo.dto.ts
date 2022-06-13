import { Type } from "class-transformer";
import { IsArray, ValidateNested, } from "class-validator";
import { BetInputDto } from "./betInput.dto";

export class BetInfoDto {
    @IsArray()
    @ValidateNested()
    @Type(() => BetInputDto)
    betInfo: BetInputDto[]
}