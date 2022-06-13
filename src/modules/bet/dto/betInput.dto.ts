import { IsNotEmpty, IsNumber, } from "class-validator";
export enum BetType {
    ODD = "odd",
    EVEN = "even",

}


export class BetInputDto {
    @IsNumber()
    betAmount: number;

    @IsNotEmpty()
    betType: number | BetType
}

