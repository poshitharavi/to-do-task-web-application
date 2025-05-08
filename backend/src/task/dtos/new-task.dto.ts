import { IsNotEmpty, IsString } from "class-validator";

export class NewTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
