import { UserDto } from '@/modules/user/application/dto';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpArgsDto } from '../../application/dto/args';
import { RegisterUserUseCase } from '../../application/use-cases';

@Resolver()
export class AuthResolver {
  constructor(private readonly singUpUseCase: RegisterUserUseCase) {}

  @Mutation(() => UserDto)
  async signUp(@Args() input: SignUpArgsDto): Promise<UserDto> {
    return this.singUpUseCase.execute(input);
  }
}
