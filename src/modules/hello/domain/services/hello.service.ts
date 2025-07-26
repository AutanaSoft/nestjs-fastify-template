import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  getHelloMessage(): string {
    return 'Hola Mundo!';
  }

  sayHello(name: string): string {
    return `Hola ${name}!`;
  }
}
