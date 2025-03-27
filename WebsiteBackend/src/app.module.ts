import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entity/user';
import { OtpModule } from './otp/otp.module';
import { ExpensesModule } from './expenses/expenses.module';
import { Expense } from './expenses/entities/expense.entity';
import { SellModule } from './sell/sell.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { Sell } from './sell/entities/sell.entity';
import { SupplierModule } from './supplier/supplier.module';
import { Supplier } from './supplier/entities/supplier.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_HOST,
      port: Number(process.env.POSTGRESQL_PORT),
      username: process.env.POSTGRESQL_USERNAME,
      password: process.env.POSTGRESQL_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Expense, Product, Sell,Supplier],
      synchronize: true,
      }), UserModule, AuthModule, OtpModule, ExpensesModule, SellModule, ProductModule, SupplierModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
