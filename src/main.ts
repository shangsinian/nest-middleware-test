import { NestFactory } from '@nestjs/core';

import { 
  Module, 
  Controller, 
  Get, 
  Scope, 
  Inject,
  Injectable, 
  NestMiddleware, 
  MiddlewareConsumer,
  NestModule 
} from '@nestjs/common';

@Injectable()
export class MyProvider {

  public _id

  constructor() {
    this._id = parseInt(Math.round(Math.random()*1000000).toString());
  }
}

@Injectable()
export class Middleware2 implements NestMiddleware {

  constructor(
    @Inject("MY_PROVIDER") private readonly myProvider: MyProvider,
  ){}

  use(req: any, res: any, next: Function) {
    console.log(this.myProvider._id)
    next()
  }
}

@Injectable()
export class Middleware1 implements NestMiddleware {

  constructor(
    @Inject("MY_PROVIDER") private readonly myProvider: MyProvider,
  ){}

  use(req: any, res: any, next: Function) {
    console.log(this.myProvider._id)
    next()

  }
}

@Controller("api")
export class AppController {

  @Get(":id")
  getHello(): string {
    return "Hello World";
  }
}


@Module({
  imports: [],
  controllers: [AppController],
  providers: [{
    provide: "MY_PROVIDER",
    scope: Scope.REQUEST,
    useClass: MyProvider,
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware1, Middleware2)
      .forRoutes('*');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
